# Locaith AI Frontend (React + Vite)

Locaith AI hiện được chuyển sang frontend thuần React chạy với Vite. Toàn bộ giao diện trước đây (HTML/CSS/JS) đã được đóng gói vào client/ và tái sử dụng lại toàn bộ asset, nên bạn không còn phải chạy server Go nữa.

## Cách chạy dự án

1. Mở Terminal trong thư mục gốc dự án.
2. Cài dependencies cho frontend:
   `ash
   cd client
   npm install
   `
3. Chạy môi trường phát triển:
   `ash
   npm run dev
   `
   Vite sẽ hiển thị URL (mặc định http://localhost:5173) – mở địa chỉ này trong trình duyệt để xem giao diện.

## Build production

`ash
cd client
npm run build
`
Gói build sẽ nằm trong client/dist/ và sẵn sàng deploy lên bất kỳ static hosting nào (Vercel, Netlify, Cloudflare Pages...).

## Cấu trúc thư mục

`
client/
  public/           # Asset tĩnh (favicon, logo, media...)
  src/
    App.tsx        # Header React + inject HTML legacy
    page.html      # Nội dung landing page gốc
    index.css      # Toàn bộ stylesheet lấy từ site cũ
    main.tsx       # Điểm vào ứng dụng React
  index.html       # Template Vite + metadata
  package.json     # Scripts & dependencies

main.go            # Server Go cũ (không còn sử dụng)
static/, templates/ # Mã nguồn HTML/JS cũ để tham khảo
`

## Ghi chú chuyển đổi

- Header được viết lại bằng React để xử lý mở/đóng navigation trên mobile.
- Phần thân trang và footer được giữ nguyên HTML ban đầu và render lại thông qua dangerouslySetInnerHTML nhằm đảm bảo layout y hệt.
- Stylesheets và media gốc được đưa vào client/public và client/src/index.css.
- Có thể tiếp tục chia nhỏ giao diện thành component React thuần nếu muốn mở rộng trong tương lai.

Nếu bạn cần loại bỏ hẳn phần mã Go và asset cũ, chỉ cần xóa main.go, static/, 	emplates/ sau khi chắc chắn không còn dùng đến.
