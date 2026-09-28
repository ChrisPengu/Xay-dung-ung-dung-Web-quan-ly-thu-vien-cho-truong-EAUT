# EAUT Library - ứng dụng quản lý thư viện

EAUT Library là website mô phỏng công việc quản lý thư viện của Trường Đại học Công nghệ Đông Á (EAUT), được xây dựng cho bài tập lớn môn Kiểm thử phần mềm. Nhóm có thể dùng website để trình bày luồng nghiệp vụ và chạy ba bộ kiểm thử Unit, Integration, System.

**Đây là sản phẩm học tập, không phải hệ thống chính thức của EAUT.** Tài khoản, email, sách và chính sách mượn trong dự án đều là dữ liệu mẫu; không nhập thông tin cá nhân thật hoặc triển khai server công khai khi còn mật khẩu mẫu.

## Chức năng chính

| Người dùng | Có thể làm |
| --- | --- |
| Khách | Xem kho sách, tìm theo tên/tác giả/mã/ISBN, lọc thể loại và xem số bản còn |
| Bạn đọc | Đăng nhập, xem sách đang mượn và lịch sử, sửa hồ sơ, đổi mật khẩu |
| Thủ thư | Thêm/sửa/lưu trữ đầu sách; thêm bản, sửa kệ và tình trạng tốt/hỏng/mất; tìm/tạo/khóa/mở độc giả; lập, gia hạn và nhận trả phiếu mượn |
| Admin | Có các quyền quản lý đang có của thủ thư và xem dashboard; chưa có màn hình cấu hình chính sách hoặc quản trị nhân viên riêng |

Mỗi đầu sách có thể có nhiều **bản sách vật lý**. Một bản chỉ có tối đa một phiếu mượn đang mở. Bản hỏng/mất hoặc đang mượn không thể cho mượn tiếp. Chính sách demo: tối đa 5 bản/độc giả, hạn 14 ngày, gia hạn tối đa một lần thêm 14 ngày. Độc giả bị khóa hoặc quá hạn không thể mượn mới; tài khoản bị khóa không thể gia hạn nhưng thủ thư vẫn nhận trả sách.

## Công nghệ và cấu trúc

- SvelteKit, Svelte 5, TypeScript cho giao diện và server; CSS responsive và icon Lucide.
- SQLite tích hợp trong Node.js 24; **không cần MySQL, Docker hay XAMPP**.
- Vitest cho Unit/Integration; Playwright và Chrome cho System test.
- Logo nguyên bản được lấy từ [website EAUT](https://eaut.edu.vn/wp-content/uploads/2018/11/logo-1.png), chỉ dùng trong bản trình bày học tập. Giao diện lấy cảm hứng từ màu logo, không khẳng định đây là bộ nhận diện được trường phê duyệt.

```text
src/routes/             Trang web và form action
src/lib/server/         SQLite, tài khoản, phân quyền, nghiệp vụ
src/app.css             Giao diện responsive
static/eaut-logo.png    Logo nguồn EAUT
tests/unit/             Kiểm thử quy tắc
tests/integration/      Kiểm thử nghiệp vụ + SQLite bộ nhớ
tests/system/           Kiểm thử trên trình duyệt Chrome
PROJECT_PLAN.md         Kế hoạch theo mục tiêu
DEVELOPMENT_LOG.md      Nhật ký quá trình làm việc
TEST_EXECUTION.md       Kết quả chạy test gần nhất
```

## Cài và mở website

### Cách nhanh nhất trên Windows

1. Cài [Node.js 24](https://nodejs.org/en/download). Kiểm tra bằng `node --version`; kết quả cần bắt đầu bằng `v24.`.
2. Giải nén hoặc clone dự án, mở thư mục gốc chứa `package.json`.
3. Nhấp đúp [run.cmd](run.cmd). Nếu chưa có `node_modules`, chương trình tự chạy `npm ci`; lần đầu cần Internet để tải thư viện. Sau đó Vite chạy và mở trình duyệt.
4. Giữ cửa sổ lệnh đang mở trong khi dùng website. Nhấn `Ctrl+C` để dừng.

Địa chỉ mặc định là `http://127.0.0.1:5173`. Nếu cổng này đã có chương trình khác, Vite sẽ hiển thị và mở cổng kế tiếp, ví dụ 5174. Lần chạy đầu tự tạo SQLite và sách mẫu.

### Chạy bằng terminal trên Windows/macOS/Linux

Yêu cầu Node.js 24 và npm. Chrome chỉ cần khi chạy System test.

```bash
npm ci
npm run dev -- --host 127.0.0.1
```

Mở địa chỉ Vite in trong terminal. Không dùng `file://` để mở HTML vì đây là ứng dụng có server và database.

### Chạy bản build giống môi trường trình bày

```powershell
npm run check
npm run build
$env:HOST = '127.0.0.1'
$env:PORT = '4173'
$env:ORIGIN = 'http://127.0.0.1:4173'
npm start
```

Mở `http://127.0.0.1:4173`. Trên macOS/Linux, đặt ba biến môi trường tương đương trong shell. `ORIGIN` phải khớp địa chỉ truy cập; nếu sai, SvelteKit có thể từ chối form POST.

## Tài khoản để trình bày

| Vai trò | Tên hiển thị | Email đăng nhập | Mật khẩu |
| --- | --- | --- | --- |
| Admin | Vũ Mười | `vumuoi@eaut.edu.vn` | `Demo123!` |
| Thủ thư | Bá Hiếu | `bahieu@eaut.edu.vn` | `Demo123!` |
| Bạn đọc | Qang Minh | `qangminh@eaut.edu.vn` | `Demo123!` |

Đây là **địa chỉ giả để demo**, không chứng minh quyền sở hữu hộp thư EAUT. Bản dữ liệu mẫu còn có bạn đọc Trần Quốc Bảo, nhưng ba tài khoản trên đủ cho luồng trình bày. Khi mở database demo tạo bởi phiên bản trước, ứng dụng chỉ đổi các dòng có đúng mã, vai trò, tên và email mặc định; mật khẩu, phiếu mượn và dữ liệu tùy chỉnh được giữ nguyên. Nếu bạn từng tự sửa thông tin tài khoản mẫu, migration sẽ bỏ qua dòng đó để tránh ghi đè.

## Hướng dẫn thao tác

### Luồng thủ thư hoặc admin

1. Vào **Đăng nhập** bằng tài khoản Bá Hiếu hoặc Vũ Mười. Trang **Tổng quan** cho biết số đầu sách, bản sẵn có, phiếu đang mượn và độc giả hoạt động.
2. Mở **Đầu sách & bản sách**. Tìm/lọc, chọn **Thêm đầu sách**, nhập mã, tên, tác giả, thể loại và các trường cần thiết. Chọn một đầu sách để xem chi tiết hoặc **Chỉnh sửa**.
3. Trong chi tiết đầu sách, thêm **bản sách** bằng mã cá biệt và vị trí kệ. Ở bảng **Quản lý bản sách**, có thể đổi kệ và tình trạng. Chọn **Hỏng** hoặc **Mất** sẽ khiến bản không sẵn có để cho mượn. Bản đang mượn phải được nhận trả trước khi chỉnh tình trạng.
4. Mở **Quản lý độc giả** để tìm theo mã/tên/email, lọc trạng thái, tạo độc giả mới bằng email `@eaut.edu.vn`, hoặc **Khóa/Mở lại**. Khóa tài khoản không xóa lịch sử mượn.
5. Mở **Phiếu mượn - trả** và chọn **Lập phiếu mượn**. Chọn độc giả đang hoạt động và bản còn sẵn. Trong danh sách phiếu, dùng **Gia hạn** hoặc **Trả sách**. Phiếu quá hạn được đánh dấu riêng.
6. Muốn bỏ một đầu sách khỏi kho hiển thị, vào chi tiết và chọn **Lưu trữ đầu sách**. Đây là lưu trữ mềm, không xóa lịch sử; phải nhận trả mọi bản đang mượn trước.

### Luồng bạn đọc

1. Đăng nhập bằng tài khoản Qang Minh.
2. Mở **Kho sách** để tìm/lọc sách và xem số bản còn.
3. Mở **Sách của tôi** để xem phiếu, hạn trả và trạng thái.
4. Mở **Tài khoản** để sửa họ tên/email EAUT hoặc đổi mật khẩu. Đổi mật khẩu sẽ đăng xuất các phiên cũ.

Website chưa cho bạn đọc tự lập phiếu mượn; thủ thư thực hiện tại quầy mô phỏng. Người dùng không thể tự tạo tài khoản thủ thư/admin qua giao diện.

## Database, dữ liệu và sao lưu

Mặc định database ở `data/eaut-library.sqlite`; các tệp `-wal`/`-shm` có thể xuất hiện khi server chạy. Dữ liệu này **không được đưa lên GitHub**. Các bảng chính: `users`, `sessions`, `books`, `copies`, `loans`.

- Muốn thử với database mới mà không xóa dữ liệu cũ, trên PowerShell đặt `$env:DATABASE_PATH = 'data/eaut-fresh.sqlite'` trước khi chạy. Để trở lại mặc định, mở terminal mới hoặc bỏ biến môi trường.
- Muốn database tạm chỉ trong bộ nhớ: `$env:DATABASE_PATH = ':memory:'`. Dừng server là dữ liệu mất.
- `DEMO_SEED=false` tắt tạo tài khoản/sách mẫu trên database rỗng. Hiện chưa có quy trình cấp admin đầu tiên nếu tắt seed, nên không dùng tùy chọn này khi trình bày.
- Để sao lưu, dừng server rồi sao chép SQLite và `-wal`/`-shm` nếu còn. Không xóa database hiện có để làm mới demo; dùng `DATABASE_PATH` khác an toàn hơn.

## Chạy kiểm thử

```bash
npm run check
npm run test:unit
npm run test:integration
npm test
npm run build
npm run test:system
```

`npm test` chạy Unit và Integration trên SQLite trong bộ nhớ. System test tự chạy bản build ở `127.0.0.1:4190` với database `:memory:` và điều khiển Chrome cài sẵn; vì vậy **phải build trước**. Kết quả ảnh/trace có thể tái tạo ở `test-results/`, không commit thư mục này. Kết quả thật gần nhất nằm trong [TEST_EXECUTION.md](TEST_EXECUTION.md); yêu cầu REQ-01 đến REQ-12 và phạm vi còn mở nằm trong [REQUIREMENTS_AND_TEST_PLAN.md](REQUIREMENTS_AND_TEST_PLAN.md).

Các tệp Word/Excel mẫu ở thư mục gốc là tài liệu phục vụ báo cáo môn học, không phải kết quả test của dự án. Không sao chép số liệu mẫu thành kết quả Pass.

## Chuẩn bị và đưa lên GitHub

`.gitignore` loại trừ `node_modules/`, build/cache, `data/`, `test-results/`, `.env` và ảnh QA tạm. **Giữ lại** mã nguồn, `package.json`, `package-lock.json`, logo, README, kế hoạch/nhật ký và các mẫu báo cáo BTL. Trước khi commit, luôn xem danh sách tệp bằng `git status`; không dùng `git add -f` để thêm database hoặc mật khẩu.

Thư mục hiện chưa cần có Git repository. Nếu bạn tạo repository mới trên GitHub, tại thư mục dự án chạy:

```bash
git init
git add .
git status --short
git commit -m 'EAUT Library demo'
git branch -M main
git remote add origin https://github.com/USERNAME/eaut-library.git
git push -u origin main
```

Thay `USERNAME` và tên repository cho đúng tài khoản của bạn; không chạy `git remote add` nếu đã cấu hình remote. Không tải cả thư mục `node_modules` bằng giao diện web GitHub. Người nhận chỉ cần clone, cài Node.js 24 và chạy `run.cmd` hoặc `npm ci` rồi `npm run dev`.

## Lỗi thường gặp và giới hạn

- **Không nhận lệnh `node` hoặc phiên bản không phải 24:** cài Node.js 24, đóng và mở lại terminal.
- **Cổng 5173 bận:** xem địa chỉ mới Vite in ra. `run.cmd` sẽ mở đúng cổng mới.
- **Đăng nhập bằng email cũ không được:** dùng ba email mới trong bảng trên. Dữ liệu demo cũ được đổi tự động khi server nạp lại và dòng vẫn khớp bản mẫu.
- **Form POST bị từ chối ở bản production:** đặt `ORIGIN` trùng địa chỉ/port đang mở.
- **`node:sqlite` hiện cảnh báo experimental:** đây là cảnh báo từ Node 24, không phải lỗi khởi động. Bản BTL chưa được thiết kế để triển khai nhiều máy hoặc production quy mô trường.
- **System test không mở Chrome:** cài Google Chrome hoặc chỉnh Playwright theo trình duyệt được hỗ trợ; Unit/Integration không cần Chrome.

Chưa có SSO EAUT, xác minh email thật, phí phạt, giữ chỗ, nhập/xuất Excel, thông báo email hoặc phân quyền quản trị nhân viên nâng cao. Chính sách 5 bản/14 ngày/1 lần gia hạn là giả định của nhóm, không phải quy định chính thức của EAUT.

Tài liệu kỹ thuật: [SvelteKit](https://svelte.dev/docs/kit/introduction), [Node SQLite](https://nodejs.org/api/sqlite.html), [Playwright](https://playwright.dev/docs/intro). Mô hình nghiệp vụ tham khảo [Koha](https://github.com/Koha-Community/kohadocs) và [FOLIO](https://docs.folio.org/docs/about-folio/features/), không sao chép mã hay giao diện.
