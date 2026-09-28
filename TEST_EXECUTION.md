# Kết quả kiểm thử EAUT Library - 2026-09-28

Đây là kết quả chạy tự động thật của bản website hiện tại, không phải số liệu từ các mẫu Excel. Môi trường: Windows, Node.js 24, Google Chrome, SQLite `:memory:` cho Integration và System test.

| Bộ | Lệnh | Kết quả | Phạm vi đã chạy |
| --- | --- | --- | --- |
| Unit | `npm run test:unit` | 6 ca đạt qua `npm test` | Tính hạn, biên quá hạn, giới hạn mượn, gia hạn và email EAUT |
| Integration | `npm run test:integration` | 13 ca đạt qua `npm test` | Mượn/trả, khóa độc giả, tình trạng bản sách, chuyển email/tên demo có điều kiện, lưu trữ và thống kê kho |
| System | `npm run test:system` | 6 ca đạt | ST-01 tra cứu; ST-02 luồng thủ thư; ST-03 phân quyền; ST-04 mobile; ST-05 quản lý bản sách/độc giả; ST-06 admin Vũ Mười đăng nhập |

Lượt xác nhận cuối sau G10: `npm run check` có 0 lỗi và 0 cảnh báo; `npm test` có 19/19 ca đạt; `npm run build` đạt; `npm run test:system` có 6/6 ca đạt. `run.cmd` đã được thử ở G9: Vite tự dùng cổng 5174 khi 5173 có server của dự án. `npm audit --omit=dev` báo 0 lỗ hổng production ở lượt kiểm tra sau G9; chưa chạy lại ở G10.

Ảnh kiểm tra giao diện mới được System test tạo trong `test-results/`: dashboard, kho sách desktop/mobile, bảng đầu sách của thủ thư, độc giả desktop/mobile và bản sách desktop/mobile. Thư mục này được loại trừ trong `.gitignore` và có thể tái tạo bằng lệnh test. Hai ảnh cũ trong `qa/` đã được dọn ở G10 vì phản ánh giao diện trước G9. Không nên xem ảnh là bằng chứng cho các yêu cầu chưa được kiểm thử.

Chưa kiểm thử: chạy đồng thời nhiều tiến trình, ma trận quyền đầy đủ mọi URL/action, khả năng truy cập theo WCAG, nhiều trình duyệt, tải lớn và mọi nhánh dữ liệu lỗi. Thành viên phụ trách test cần bổ sung bảng test case với bước, dữ liệu, expected/actual, ngày chạy và bằng chứng theo mẫu Word/Excel trong thư mục gốc.

Để tái hiện kết quả: chạy `npm ci`, `npm run check`, `npm test`, `npm run build`, `npm run test:system` theo thứ tự. Chrome cần được cài sẵn cho System test; các ca dùng database trong bộ nhớ, không sửa file demo.
