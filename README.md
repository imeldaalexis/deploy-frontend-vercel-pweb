### Langkah-Langkah Deployment Web Vercel Menggunakan Postman

1. Deploy backend message logger web menggunakan API dengan alamat endpoint ```https://deploy-frontend-vercel-pweb.vercel.app/api/messages``` untuk mengecek apakah sistem backend sudah berjalan dengan baik atau belum.

2. Pada Postman, kirimkan API Request pada alamat API logger web dengan memilih metode request GET ```https://deploy-frontend-vercel-pweb.vercel.app/api/messages``` untuk mengakses pesan-pesan yang sudah terdata pada backend web.

3. Jika sudah tidak ada kendala tambahan (sinyal sudah menunjukkan 200 OK), data backend logger sudah dipastikan terintegrasi pada Postman.

4. Setelah backend dipastikan berjalan dengan baik, hubungkan frontend yang telah dideploy di Vercel dengan alamat ```https://deploy-frontend-vercel-pweb.vercel.app/``` dan GitHub ```https://github.com/imeldaalexis/deploy-frontend-vercel-pweb``` agar frontend-backend dapat terintegrasi dengan baik.

6. Setelah mengintegrasi alamat Vercel, deploy ulang ke Postman untuk memastikan bahwa data frontend-backend yang masuk pada logger sudah tercatat dengan benar.
