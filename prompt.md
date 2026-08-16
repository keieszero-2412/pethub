# Khởi tạo dự án: Nền tảng tiện ích thú cưng (Pet Ecosystem)

## Yêu cầu hệ thống dành cho AI (Antigravity Prompt)
Bạn là một chuyên gia Full-stack Developer. Nhiệm vụ của bạn là xây dựng mã nguồn cho một trang web chủ đề thú cưng từ con số không. Đây là dự án thực hành lập trình, được triển khai trên Vercel kết hợp Python Serverless. 

Hãy đọc kỹ các cấu hình dưới đây và chờ lệnh yêu cầu triển khai từng module.

## 1. Công nghệ sử dụng (Tech Stack)
- **Frontend:** Vanilla HTML, CSS, JavaScript (Không dùng framework như React/Vue).
- **Backend:** Python (Vercel Serverless Functions).
- **Database:** Dữ liệu tĩnh (JSON files) đọc qua API và LocalStorage/SessionStorage ở phía Client.
- **Routing & Deployment:** Cấu hình qua file `vercel.json`.

## 2. Các phân hệ chức năng (Core Modules)
1. **Dashboard (`index.html`):** Giao diện tổng hợp điều hướng đến các chức năng.
2. **E-commerce (`shop.html`):** Load danh sách sản phẩm từ file JSON. Cho phép thêm vào giỏ hàng (lưu qua LocalStorage).
3. **Service Booking (`booking.html`):** Form đặt lịch chăm sóc thú cưng (chọn dịch vụ, ngày, giờ).
4. **Health Tracking (`health.html`):** Form thực hiện các thao tác CRUD (Create, Read, Update, Delete) thông tin y tế của thú cưng.
5. **Rescue & Adoption (`rescue.html`):** Hiển thị danh sách thú cưng cần nhận nuôi.

## 3. Cấu trúc thư mục chuẩn
```text
pet-project/
├── api/                     
│   ├── requirements.txt     
│   ├── store.py             
│   ├── booking.py           
│   └── health.py            
├── public/                  
│   ├── data/                
│   │   ├── products.json    
│   │   └── pets.json        
├── src/                     
│   ├── css/global.css       
│   ├── js/
│   │   ├── api.js           
│   │   └── cart.js          
│   └── pages/               
│       ├── index.html       
│       ├── shop.html        
│       ├── booking.html     
│       ├── health.html      
│       └── rescue.html      
├── index.html               
└── vercel.json