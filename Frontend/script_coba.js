let contacts = [];
let currentContact = ""; // Keep track of the currently open chat
const myContact = "6285174388804@c.us";
let debounceTimeout;

window.onload = () => {
  fetch("http://localhost:3003/api/messages")
    .then((response) => response.json())
    .then((messages) => {
      // Extract contacts from messages
      messages.forEach((message) => {
        let fromUser = message.from;
        let toUser = message.to;
 
        if (fromUser !== myContact && !contacts.includes(fromUser)) {
          contacts.push(fromUser);
        }

        if (toUser !== myContact && !contacts.includes(toUser)) {
          contacts.push(toUser);
        }
      });

      // Render UI for each contact
      const userData = document.querySelector(".col-md-4");
      if (!userData) {
        console.error("Element with class 'col-md-4' not found.");
        return;
      }

      const friendList = document.querySelector("#friend-list");
      if (!friendList) {
        console.error("Element with class 'friend-list' not found.");
        return;
      }
      
      
      function formatContactName(contact) {
        return contact.replace(/@(c|g)\.us$/, ""); // Remove "@c.us" suffix
      }
      
      contacts.forEach((contact) => {
        const user_friendRow = document.createElement("div");
        user_friendRow.className = "friend-row friend-row--onhover";
        user_friendRow.setAttribute("data-contact", contact);

        const user_pfp = document.createElement("img");
        user_pfp.className = "profile-image";

        const user_containerList = document.createElement("div");
        user_containerList.className = "text";

        const user_displayName = document.createElement("h6");
        user_displayName.className = "text";
        user_displayName.innerHTML = formatContactName(contact);
        user_containerList.appendChild(user_pfp);
        user_containerList.appendChild(user_displayName);
        user_friendRow.appendChild(user_containerList);
        
        friendList.appendChild(user_friendRow);

         // Click event for each friend row
        user_friendRow.addEventListener("click", () => {
          currentContact = contact; // Set the current contact
          displayUserMessages(contact, messages);
        });

      });

      userData.appendChild(friendList);
      const searchInput = document.querySelector("#search-box input");
      const searchBox = document.querySelector("#search-box");

      searchInput.addEventListener("keydown", (e) => {
        const searchTerm = e.target.value.toLowerCase();
      
        // Filter the contacts that match the search term
        const filteredContacts = contacts.filter(contact => 
          contact.toLowerCase().includes(searchTerm)
        );
      
        // Clear the friend list UI
        friendList.innerHTML = "";
      
        // Re-render the filtered contacts
        filteredContacts.forEach(contact => {
          const friendRow = createFriendRow(contact);
          friendList.appendChild(friendRow);
        });
      });
      // if (searchBox) {
      //   searchBox.addEventListener("keyup", (e) => {
      //     clearTimeout(debounceTimeout);
      //     const searchTerm = e.target.value.toLowerCase();
          
      //     if (e.key === "Enter") {
      //       // Trigger search immediately on Enter key
      //       displayFriendRow(contacts, searchTerm);
      //     } else {
      //       debounceTimeout = setTimeout(() => {
      //         displayFriendRow(contacts, searchTerm);
      //       }, 1000);
      //     }
      //   });
      // }

      // Function to display messages for a specific contact
      function displayUserMessages(contact, messages, searchTerm = "") {
        const userMessages = messages.filter((message) => {
          if (contact.includes('@g.us')) {
            return (message.from === contact || message.to === contact);
          } else {
            return (message.from === contact || message.to === contact) &&
                   !message.from.includes('@g.us') &&
                   !message.to.includes('@g.us');
          }
          
        });
      
        // Sort the filtered messages by timestamp
        userMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        
        const chatPanelContainer = document.querySelector(".chat-panel-container");
        if (!chatPanelContainer) {
            console.error("Element with class 'chat-panel-container' not found.");
            return;
        }

        chatPanelContainer.innerHTML = "";
      
        // Create the user banner with contact info
        const user_banner = document.createElement("div");
        user_banner.className = "user-banner";
      
        const user_fullInfo = document.createElement("div");
        user_fullInfo.className = "text";
      
        const user_numberInfo = document.createElement("h6");
        const user_tapForMoreInfo = document.createElement("p");
      
        user_numberInfo.innerHTML = formatContactName(contact); 
        user_tapForMoreInfo.innerHTML = "";
      
        //bookmark dulu  tadi sampek disini untuk menambah innerHTML 
        const searchBox = document.createElement("div");
        searchBox.className = "search-box-user";
        searchBox.innerHTML = `
            <div class="input-wrapper">
                <i class="material-icons">search</i>
                <input type="text" placeholder="Cari messagenya <3">
            </div>
        `;

        chatPanelContainer.appendChild(searchBox);

        user_fullInfo.appendChild(user_numberInfo);
        user_fullInfo.appendChild(user_tapForMoreInfo);
        user_banner.appendChild(user_fullInfo);

        chatPanelContainer.appendChild(user_banner);

        // Create the chat panel to display messages
        const chatPanel = document.createElement("div");
        chatPanel.className = "chat-panel";
        
        let lastDate = null;
        // Loop through the user messages and display them
        userMessages.forEach((message) => {
          console.log("Message object:", message);
          console.log("hasMedia property:", message.hasMedia);
          const messageRow = document.createElement("div");
          messageRow.className = "row g-0";

          // if (message._data && message._data.t) {
          const timestamp = message._data.t;
          const date = new Date(timestamp * 1000);
          const messageDate = formatDate(date);

          const messageCol = document.createElement("div");
          const chatBubble = document.createElement("div");
          
          if (lastDate !== messageDate) {
             const dateDiv = createDateDiv(messageDate);
             chatPanel.appendChild(dateDiv);
             lastDate = messageDate; // Update the last dat
          }

          // Setting posisi doang, gak ada inner html nya
          if (message.id && message.id.fromMe) {
            messageCol.className = "col-md-3 offset-md-9";
            chatBubble.className = "chat-bubble chat-bubble--pink";
            
          } else if (message.id) {
            messageCol.className = "col-md-3";
            chatBubble.className = "chat-bubble";
            if(message.hasQuotedMsg){
              const quotedMsgBody = message._data.quotedMsg.body;

              // Split the quoted message into contact and message
              const parts = quotedMsgBody.split(' >> ');
              let  contactName = parts[0].trim(); // The part before '>>' is the contact name
              const quotedMessage = parts[1].trim(); // The part after '>>' is the actual message


              const contactParts = contactName.split(' ');
              if (contactParts.length > 1 && isNaN(contactParts[1])) {
                  // If there's a second part and it's a string (not a number), use it as contact name
                  contactName = contactParts[1];
              } else {
                  // If there's no second string, keep the number part (or any other logic you prefer)
                  contactName = contactParts[0];
              }

              // Create the quoted message container
              const quotedMsg = document.createElement("div");
              quotedMsg.className = "chat-bubble chat-bubble--pink";

              // Set the contact name and quoted message separately
              const contactDiv = document.createElement("div");
              contactDiv.className = "quoted-contact";
              contactDiv.textContent = contactName; // Set the contact name

              const messageDiv = document.createElement("div");
              messageDiv.className = "quoted-message";
              messageDiv.textContent = quotedMessage; // Set the quoted message

              // Append the contact and message to the quoted message container
              quotedMsg.appendChild(contactDiv);
              quotedMsg.appendChild(messageDiv);

              messageCol.appendChild(quotedMsg); // Add the quoted message to the message column
              console.log("done quoted message");
            }
          } else {
            console.warn("Skipping message without id:", message);
          }
      
          // Format the message body and timestamp
          const messageBody = highlightTextUser(message.body, searchTerm);
          const messageTime = formatTime(message.timestamp);
          
          
          if(message.hasMedia){
            //make the source using converted base64 
            let base64Data = message.body;
            let mimeType = getMimeType(base64Data);

            let dataUri = `data:${mimeType};base64,${base64Data}`;
            console.log(dataUri);

            chatBubble.innerHTML = `
            <img src="${dataUri}" alt="Media" style="max-width: 100%; height: auto;"><br>
            <span class="chat-time">${messageTime}</span>`;
            messageCol.appendChild(chatBubble);
            messageRow.appendChild(messageCol);
            chatPanel.appendChild(messageRow);
          }
          else{
            chatBubble.innerHTML = `${messageBody} <br><span class="chat-time">${messageTime}</span>`;
              // Insert the formatted message and timestamp into the chat bubble
            messageCol.appendChild(chatBubble);
            messageRow.appendChild(messageCol);
            chatPanel.appendChild(messageRow);
          }
        });
      
        // Append the chat panel to the user data banner
        chatPanelContainer.appendChild(chatPanel);

        const existingReplyBox = document.getElementById("reply-box");

        // Remove it from the DOM if already present in the HTML
        if (existingReplyBox) {
            existingReplyBox.parentNode.removeChild(existingReplyBox);
        }

        // Dynamically create the reply box for this contact
        const replyBox = document.createElement("div");
        replyBox.id = "reply-box";

        replyBox.innerHTML = `
          <form id="messageForm" action="http://localhost:3003/api/post" method="post">
            <div class="input-group">
              <input type="text" name="body" class="form-control" placeholder="Type a message..." required>
              <input type="hidden" name="currentContact" value="${currentContact}">
              <input type="hidden" name="myContact" value="${myContact}">
              <input type="hidden" id="base64-file" name="fileBase64">
              <button class="send-button btn btn-primary" type="submit">Send</button>
              <label for="file-upload" class="btn btn-pink">Choose file</label>
              <input type="file" id="file-upload" class="d-none" accept="image/png, image/jpeg, image/jpg">
            </div>
          </form>
        `;

        // Append the reply box to the chat panel container
        document.querySelector(".chat-panel-container").appendChild(replyBox);  
        
        // Add event listener to handle file selection and Base64 conversion
        const fileUploadInput = document.getElementById("file-upload");
        const base64Input = document.getElementById("base64-file");

        fileUploadInput.addEventListener("change", async (event) => {
          const file = event.target.files[0]; // Get the selected file
          if (file) {
            try {
              const base64Data = await convertToBase64(file);
              base64Input.value = base64Data; // Set Base64 string to the hidden input
              alert("File successfully converted to Base64!");
            } catch (error) {
              console.error("Error converting file to Base64:", error);
              alert("Failed to convert the file. Please try again.");
            }
          } else {
            alert("No file selected.");
          }
        });

        document.querySelector(".search-box-user").addEventListener("keyup", (e) => {
          clearTimeout(debounceTimeout); // Clear any existing timeout
          const searchTerm = e.target.value.toLowerCase();
      
          if (e.key === "Enter") {
              // Trigger search immediately on Enter key
              displayUserMessages(currentContact, messages, searchTerm);
          } else {
              // Set a timeout for debounce
              debounceTimeout = setTimeout(() => {
                  displayUserMessages(currentContact, messages, searchTerm);
              }, 1000); // Delay of 1s
          }
          });
      }

      function updateReplyBoxContact(contact) {
        const form = document.querySelector("#reply-box form");
        form.querySelector('input[name="currentContact"]').value = contact;
      }

      // Function to highlight search term in text
      function highlightText(text, searchTerm) {
        if (!searchTerm) return text;
        const regex = new RegExp(`(${searchTerm})`, "gi");
        return text.replace(regex, "<mark>$1</mark>");
      }

      function highlightTextUser(text, searchTerm) {
        if (!searchTerm) return text;
        const regex = new RegExp(`(${searchTerm})`, "gi");
        return text.replace(regex, "<mark>$1</mark>");
      }

      // Function to format the timestamp to "HH:MM" format
      function formatTime(timestamp) {
        const date = new Date(timestamp);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
      }

      function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
      }
      
      // Function to create a date separator div
      function createDateDiv(date) {
        const dateDiv = document.createElement('div');
        dateDiv.className = 'date-separator';
        dateDiv.textContent = date;
        return dateDiv;
      }

      function createFriendRow(contact) {
        const user_friendRow = document.createElement("div");
        user_friendRow.className = "friend-row friend-row--onhover";
        user_friendRow.setAttribute("data-contact", contact);
      
        const user_pfp = document.createElement("img");
        user_pfp.className = "profile-image";
      
        const user_containerList = document.createElement("div");
        user_containerList.className = "text";
      
        const user_displayName = document.createElement("h6");
        user_displayName.className = "text";
        user_displayName.innerHTML = formatContactName(contact);
      
        user_containerList.appendChild(user_pfp);
        user_containerList.appendChild(user_displayName);
        user_friendRow.appendChild(user_containerList);
      
        // Add click event to open the chat
        user_friendRow.addEventListener("click", () => {
          currentContact = contact;
          displayUserMessages(contact, messages);
        });
      
        return user_friendRow;
      }

      function displayFriendRow(contacts, searchTerm) {
        friendList.innerHTML = "";
        contacts.forEach((contact) => {
            // If contact doesn't match search term, skip
            const regex = new RegExp(searchTerm, 'gi');
            if (!regex.test(contact)) {
              friendList.innerHTML = "";
              return;  // Skip contact if search term doesn't match
            }    

            const user_friendRow = document.createElement("div");
            user_friendRow.className = "friend-row friend-row--onhover";
            user_friendRow.setAttribute("data-contact", contact);
    
            const user_pfp = document.createElement("img");
            user_pfp.className = "profile-image";
    
            const user_containerList = document.createElement("div");
            user_containerList.className = "text";
    
            const user_displayName = document.createElement("h6");
            user_displayName.className = "text";
            user_displayName.innerHTML = formatContactName(contact);
            user_containerList.appendChild(user_pfp);
            user_containerList.appendChild(user_displayName);
            user_friendRow.appendChild(user_containerList);
    
            friendList.appendChild(user_friendRow);
    
            // Click event for each friend row
            user_friendRow.addEventListener("click", () => {
                currentContact = contact; // Set the current contact
                displayUserMessages(contact, messages);
            });
        });
    }
    

      alert("Data loaded successfully");
    })
    .catch((error) => console.error("Error:", error));
};

function convertToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]); // Remove the Base64 prefix
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function getMimeType(base64String) {
  // Get the first few characters of the base64 string
  if (base64String.startsWith('/9j/')) {
      return 'image/jpeg';
  } else if (base64String.startsWith('iVBORw0K')) {
      return 'image/png';
  } else if (base64String.startsWith('R0lGOD') || base64String.startsWith('GIF8')) {
      return 'image/gif';
  } else if (base64String.startsWith('Qk')) {
      return 'image/bmp';
  } else {
      return null; // Unknown format
  }
}

// // Fix the missing closing bracket and event listener for the form
// document.querySelector('form').addEventListener('submit', function(event) {
//   console.log("Form submitted");
//   event.preventDefault();  // Prevent default form submission for testing purposes
// });
