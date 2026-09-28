# Nhật ký phát triển EAUT Library

Tệp này chỉ ghi công việc của dự án ứng dụng web quản lý thư viện EAUT. Không sao chép trạng thái, kết quả kiểm thử, database hoặc tiến trình của dự án DocuCatalog sang đây.

## Quy ước ghi nhật ký

Sau khi hoàn thành mỗi mục tiêu trong `PROJECT_PLAN.md`, thêm một mục theo mẫu:

```text
### YYYY-MM-DD - Gx - Tên mục tiêu
Trạng thái: Hoàn thành / Đang làm / Tạm dừng
Phạm vi và quyết định:
Tệp tạo hoặc sửa:
Kiểm thử và kết quả:
Lỗi hoặc rủi ro còn mở:
Mục tiêu kế tiếp:
```

Nếu một buổi làm việc chưa hoàn thành mục tiêu, vẫn ghi tiến độ, bước đã kiểm tra và lý do dừng. Không ghi mật khẩu hay thông tin cá nhân thật.

## Các mục đã thực hiện

### 2026-09-28 - G0 - Xác lập dự án và kế hoạch

Trạng thái: Hoàn thành.

- Xác nhận dự án EAUT ở thư mục `Xay dung ung dung Web quan ly thu vien cho truong EAUT`, tách biệt với DocuCatalog. Thư mục ban đầu chỉ có mẫu báo cáo BTL dạng Word và chưa có repository hay mã nguồn.
- Đọc mẫu báo cáo `Mẫu báo cáo BTL làm theo nhóm_K13_ver30062025.docx`. Mẫu yêu cầu Chương 1 tổng quan và đặc tả, Chương 2 thiết kế unit/integration/system test, Chương 3 kết quả thực thi, Chương 4 automation test, cùng kết luận và phụ lục.
- Tạo `PROJECT_PLAN.md` với phạm vi thư viện dự kiến, các mục tiêu G0-G8, tiêu chí hoàn thành và ánh xạ tới cấu trúc báo cáo.
- Tạo nhật ký riêng này và quy ước đọc lại kế hoạch, nhật ký trước mọi lượt làm việc mới.
- Chưa tạo mã nguồn, database, tài khoản hoặc tiến trình cho dự án EAUT.

Kiểm tra: xác nhận hai tệp Markdown nằm trong thư mục EAUT và không ghi vào dự án cũ.

Vấn đề cần chốt ở G1: chính sách mượn/trả, phạm vi đăng ký độc giả, yêu cầu công nghệ hoặc công cụ kiểm thử của giảng viên.

Mục tiêu kế tiếp: G1 - đặc tả yêu cầu, quy tắc nghiệp vụ và thiết kế kiểm thử.

### 2026-09-28 - G1 - Đặc tả tối thiểu và chiến lược ba bộ kiểm thử

Trạng thái: Hoàn thành bản phù hợp với ưu tiên có website để trình bày.

- Người dùng xác nhận tối thiểu ba bộ kiểm thử và ưu tiên sản phẩm web; thành viên khác sẽ mở rộng phần test. Mẫu Word cùng các tệp `Template_Unit Test Case.xls`, `IT_Test Case.xlsx`, `ST_Test Case.xlsx` dẫn tới lựa chọn ba cấp Unit, Integration, System. Nếu giảng viên đòi ba công cụ riêng, nhóm phải xác nhận và cập nhật.
- Tạo `REQUIREMENTS_AND_TEST_PLAN.md` với vai trò, luồng E2E, REQ-01 đến REQ-10, giả định chính sách 5 bản / 14 ngày / 1 lần gia hạn và ánh xạ test. Đây là chính sách demo, không phải quy định chính thức EAUT.
- Quyết định dùng SvelteKit + TypeScript + SQLite theo yêu cầu mới về web hiện đại, mã ngắn gọn. Đã bỏ đúng bộ khung Spring Boot vừa tạo, không đụng tài liệu hay dữ liệu dự án cũ. Sơ đồ dữ liệu và bảng test case đầy đủ theo mẫu Excel chuyển sang G7.
- Quyết định demo lỗi bằng một nhánh Git riêng, lỗi giới hạn mượn ở biên 5 bản; bản chính luôn giữ đúng, không tạo lỗi bảo mật hoặc mất dữ liệu.

Tệp tạo/sửa: `REQUIREMENTS_AND_TEST_PLAN.md`, `PROJECT_PLAN.md`, `DEVELOPMENT_LOG.md`.

Kiểm tra: mỗi REQ có ca test dự kiến; website thực tế đã có 8 Unit/Integration test và 4 System test chạy xanh ở thời điểm ghi nhật ký. Mẫu Unit Excel có công thức `#REF!`, không dùng số liệu mẫu làm kết quả thật.

Vấn đề mở: xác nhận cách hiểu ba bộ kiểm thử với giảng viên; các chính sách thư viện chính thức EAUT chưa được cung cấp.

Mục tiêu kế tiếp: G2 - hoàn thiện hướng dẫn chạy và môi trường tái lập; các chức năng G3-G6 đã được triển khai song song theo ưu tiên trình bày.

### 2026-09-28 - G2 - Ứng dụng và môi trường có thể chạy lại

Trạng thái: Hoàn thành.

- Thay bản khung Java thử nghiệm bằng SvelteKit 5 và TypeScript đúng với lựa chọn mới của người dùng. Dùng Node.js 24 cùng SQLite tích hợp, không cài hoặc sửa MySQL trên máy.
- Tạo schema và dữ liệu demo khi database mới; dữ liệu mặc định lưu tại `data/eaut-library.sqlite`, còn các bài test dùng database `:memory:`. Khóa phiên bản thư viện bằng `package-lock.json`.
- README ghi lệnh cài, chạy dev/production, tài khoản demo, database, sao lưu, lệnh test và giới hạn của bản BTL. Không trộn dữ liệu DocuCatalog.

Tệp chính: `package.json`, `package-lock.json`, `vite.config.ts`, `src/lib/server/db.ts`, `README.md`, `.env.example`.

Kiểm thử và kết quả: `npm run check` đạt 0 lỗi/0 cảnh báo; `npm run build` đạt; bản build mở được trên localhost. `npm audit --omit=dev` không báo lỗ hổng production tại thời điểm kiểm tra. Node SQLite in cảnh báo API thử nghiệm, đã ghi trong README.

Vấn đề còn mở: Bản SQLite tích hợp Node chưa nhằm triển khai production quy mô trường; chưa có bootstrap quản trị khi `DEMO_SEED=false`.

Mục tiêu kế tiếp: G3-G6 cho luồng trình bày thực tế.

### 2026-09-28 - G3, G4, G5 - Luồng thư viện chính

Trạng thái: Hoàn thành phần lõi trình bày; các mục mở rộng đã ghi trong kế hoạch.

- G3: đăng nhập, đăng xuất, cookie phiên HttpOnly, mật khẩu scrypt, phân quyền độc giả/thủ thư/quản trị, hồ sơ và đổi mật khẩu. Từ chối trang nghiệp vụ thủ thư với HTTP 403 khi dùng tài khoản độc giả.
- G4: tra cứu và lọc kho sách; thủ thư thêm, sửa, lưu trữ mềm đầu sách, thêm bản sách, tạo độc giả. Mã sách/mã cá biệt duy nhất; đầu sách có phiếu mượn mở không thể lưu trữ.
- G5: lập phiếu mượn, gia hạn, trả; giao dịch SQLite giữ trạng thái phiếu và bản sách đồng nhất, unique index ngăn hai phiếu mở cho cùng bản. Chính sách demo 5 bản / 14 ngày / 1 lần gia hạn, chặn quá hạn, tài khoản khóa, bản sách không sẵn có và thao tác trả lặp.
- Thêm kiểm tra năm xuất bản là số nguyên, màu bìa hợp lệ, không cho mượn bản thuộc đầu sách đã lưu trữ và không cho gia hạn với độc giả bị khóa.

Tệp chính: `src/lib/server/`, `src/routes/`, `tests/unit/`, `tests/integration/`, `tests/system/`.

Kiểm thử và kết quả: 10 ca Unit/Integration và 4 ca System đạt; ST-02 đi hết luồng thêm sách, thêm bản, tạo độc giả, mượn, trả. Kiểm tra HTTP độc lập với database trong bộ nhớ đã chạy thêm gia hạn và xác nhận độc giả bị chặn ở 3 trang thủ thư. `npm run check` và `npm run build` đạt.

Vấn đề còn mở: Chưa có test đồng thời nhiều tiến trình, chưa có giao diện sửa tình trạng bản sách và khóa/mở độc giả. Thành viên phụ trách test có thể mở rộng ca trong mẫu báo cáo.

Mục tiêu kế tiếp: G6 hoàn thiện giao diện; G7/G8 tổng hợp bằng chứng và bàn giao.

### 2026-09-28 - G6 - Giao diện trình bày desktop và mobile

Trạng thái: Hoàn thành phần lõi trình bày.

- Xây CSS responsive với bố cục sidebar, thẻ thống kê, bảng và form; nội dung tiếng Việt, trạng thái rỗng và thông báo rõ ràng. Dùng icon Lucide; không lấy logo hoặc ảnh không rõ giấy phép.
- Đã xem ảnh chụp kho sách desktop/mobile và dashboard desktop. ST-04 chạy Chrome ở viewport 390px, xác nhận không có cuộn ngang; ST-01/ST-02 kiểm tra thêm các thao tác trình duyệt.

Tệp chính: `src/app.css`, `src/routes/+layout.svelte`, `src/routes/dashboard/+page.svelte`, `src/routes/catalog/+page.svelte`, `qa/catalog-desktop.png`, `qa/catalog-mobile.png`.

Kiểm thử và kết quả: 4/4 System test đạt trên Chrome; 10/10 Unit/Integration đạt; `npm run check` 0 lỗi/0 cảnh báo.

Vấn đề còn mở: Chưa thực hiện audit accessibility toàn diện hoặc kiểm tra đa trình duyệt. Bản ảnh trong `qa/` là ảnh kiểm tra giao diện, không phải bằng chứng xác nhận mọi chức năng.

Mục tiêu kế tiếp: G7/G8 hoàn thiện tài liệu ca test và kịch bản demo lỗi tách khỏi bản chính.

### 2026-09-28 - G7/G8 - Xác nhận bản bàn giao hiện tại

Trạng thái: Đang làm. Website và bộ test cơ sở đã chạy; báo cáo BTL chi tiết còn do nhóm hoàn thiện.

- Chạy lại `npm run check`: 0 lỗi, 0 cảnh báo. `npm test`: 10/10 ca đạt. `npm run build`: đạt. `npm run test:system`: 4/4 ca đạt trong 31,7 giây trên Chrome. `npm audit --omit=dev`: 0 lỗ hổng production ở thời điểm kiểm tra.
- Tạo `TEST_EXECUTION.md` để giữ kết quả thực thi, môi trường, cách tái hiện và phạm vi chưa kiểm thử. Cập nhật ma trận System Test vì ST-03/ST-04 đã tự động hóa. Ảnh QA được giữ lại, chỉ xóa hai hồ sơ Chrome tạm do quá trình chụp ảnh tạo ra.
- Chưa khởi tạo Git nên chưa có nhánh demo lỗi. Bản chính hiện không cố ý cài lỗi; kế hoạch nhánh `demo/bug-loan-limit` ghi rõ tại mục 9 của kế hoạch và mục 5 của đặc tả. Không báo cáo bug demo là đã thực hiện.

Vấn đề còn mở: Kiểm chứng yêu cầu giảng viên về ba bộ kiểm thử; thành viên test cần điền bảng và báo cáo theo mẫu, xác nhận chính sách thư viện EAUT nếu dùng ngoài demo, kiểm thử accessibility/đa trình duyệt, và chỉ tạo nhánh demo lỗi khi nhóm chốt cách trình bày.

Mục tiêu kế tiếp: Hoàn thiện G7/G8 theo phản hồi nhóm/giảng viên; giữ website chính ổn định.

### 2026-09-28 - G9 - Bắt đầu mở rộng quản trị và nhận diện

Trạng thái: Đang làm.

- Đọc lại kế hoạch và nhật ký EAUT. Người dùng yêu cầu nhấn mạnh chức năng quản lý, giao diện tự nhiên hơn theo EAUT và khởi chạy nhanh hơn.
- Đối chiếu mô hình đầu sách/bản sách và độc giả ở tài liệu Koha, FOLIO. Chọn hai luồng có ích, vừa phạm vi BTL: cập nhật tình trạng/vị trí bản sách và khóa/mở độc giả. Giữ các nghiệp vụ phức tạp như phí phạt, đặt chỗ, SSO ngoài G9.
- Xác nhận URL logo từ HTML của website chính thức `eaut.edu.vn`, tải bản PNG 328x98 vào `static/eaut-logo.png`. Logo dùng nguyên bản; README sẽ dẫn nguồn và ghi chú không phải cổng chính thức.
- Cập nhật mục G9 trong kế hoạch trước khi sửa mã nguồn. Tiếp theo sẽ thêm service, form quản trị, test, giao diện và tệp chạy nhanh.

### 2026-09-28 - G9 - Hoàn thành quản trị và nhận diện EAUT

Trạng thái: Hoàn thành phần lõi theo tiêu chí G9.

- Thêm sửa vị trí và tình trạng tốt/hỏng/mất cho từng bản. Bản hỏng/mất chuyển sang không sẵn có; bản đang mượn không được sửa trước khi nhận trả. Thêm tìm và lọc độc giả, khóa/mở tài khoản; khóa hủy phiên hiện có và chặn mượn/gia hạn, nhưng phiếu còn tồn tại và có thể nhận trả.
- Chuyển bốn email tài khoản demo sang `@eaut.edu.vn`. Database demo cũ chỉ đổi đúng bốn địa chỉ mẫu khi địa chỉ mới chưa có người dùng; email khác giữ nguyên. Tài khoản độc giả mới và thay đổi email hồ sơ phải có đuôi EAUT; đây không phải xác minh email thật.
- Thay favicon mặc định của Svelte bằng biểu tượng sách của dự án. Dùng logo PNG nguyên bản lấy từ website EAUT, giữ tỷ lệ trên nền trắng và có thông báo rõ website là demo học tập. Chuyển giao diện sang xanh EAUT, bảng quản lý ưu tiên thao tác, dashboard có lối tắt công việc. Tài liệu Koha/FOLIO chỉ là tham khảo quy trình nghiệp vụ.
- Thêm `run.cmd`: kiểm tra Node.js 24, tự `npm ci` khi thiếu dependency, chạy Vite và mở trình duyệt. Đã thử thật trên Windows: khi cổng 5173 đang dùng, Vite mở ở 5174. Chỉ dừng tiến trình thử 5174, không dừng server có sẵn ở 5173.
- QA trực quan bắt lỗi bảng độc giả tràn ngang mobile và cột thông tin sách quá hẹp trên desktop. Đã sửa lưới, đặt bảng cuộn trong khung và chạy lại ảnh/ca System.

Tệp chính: `src/lib/server/db.ts`, `src/lib/server/library.ts`, `src/lib/server/validation.ts`, `src/routes/readers/`, `src/routes/catalog/`, `src/routes/+layout.svelte`, `src/app.css`, `static/eaut-logo.png`, `run.cmd`, `README.md`, các bộ test.

Kiểm thử và kết quả: `npm run check` 0 lỗi/0 cảnh báo; `npm test` 18/18 ca đạt (6 Unit, 12 Integration); `npm run build` đạt; `npm run test:system` 5/5 ca đạt trên Chrome, gồm ST-05 quản lý. Trang độc giả và trang bản sách không tràn khung nhìn 390px. Kết quả và giới hạn ghi tại `TEST_EXECUTION.md`.

Rà soát sau đó phát hiện dashboard vẫn đếm bản của đầu sách đã lưu trữ vào số bản sẵn có. Đã sửa truy vấn thống kê và thêm ca Integration hồi quy; 18/18 ca đạt.

Vấn đề còn mở: Chưa tích hợp xác minh email trường hoặc SSO, chưa có quản lý phí phạt/đặt trước/nhập xuất dữ liệu; cần nhóm và giảng viên xác nhận nếu mở rộng. Bản logo chỉ dùng cho bài tập, không có xác nhận thương hiệu chính thức. Báo cáo test theo mẫu môn học vẫn thuộc G7/G8.

### 2026-09-28 - G10 - Bắt đầu chuẩn bị tài khoản và GitHub

Trạng thái: Đang làm.

- Đọc lại kế hoạch và nhật ký trước khi sửa. Kiểm kê thư mục gốc: mẫu Word/Excel phục vụ BTL cần giữ; `data/` có SQLite và file WAL/SHM đang dùng, không xóa; `node_modules/`, `build/`, `.svelte-kit/`, `test-results/` là dữ liệu tạo tự động cần ignore. `qa/` có hai ảnh giao diện cũ do dự án tạo.
- Kiểm tra chỉ mã/tên/email/vai trò/trạng thái trong database hiện tại. Ba tài khoản demo AD001, TV001, SV2026001 còn tên/email mẫu ban đầu; không đọc hash mật khẩu. Chọn đổi tài khoản admin mẫu hiện có thành Vũ Mười thay vì mở thêm một tài khoản admin dùng mật khẩu công khai.
- Tạo G10 trong kế hoạch. Sẽ làm migration có điều kiện và test, rồi cập nhật README, ignore và dọn đúng ảnh QA cũ.

### 2026-09-28 - G10 - Hoàn tất tài khoản trình bày và gói bàn giao GitHub

Trạng thái: Hoàn thành theo tiêu chí G10.

- Đổi seed thành admin Vũ Mười (`vumuoi@eaut.edu.vn`), thủ thư Bá Hiếu (`bahieu@eaut.edu.vn`), bạn đọc Qang Minh (`qangminh@eaut.edu.vn`). Không tạo admin thứ hai. Với database đã có, migration chỉ cập nhật mã/vai trò/tên/email đúng mẫu cũ khi email mới chưa tồn tại; không đổi hash mật khẩu, phiên, phiếu mượn hoặc tài khoản tùy chỉnh. Đã kiểm tra read-only database hiện có sau migration: ba email mới đã xuất hiện, bạn đọc Trần Quốc Bảo vẫn giữ nguyên.
- Cập nhật gợi ý đăng nhập và test. Ca Integration mới xác nhận migration có điều kiện và chạy lặp an toàn; ST-06 xác nhận admin mới đăng nhập, mở trang quản lý. ST-02/ST-03 dùng tài khoản thủ thư/bạn đọc mới.
- Viết lại README: mục đích dự án, chức năng, công nghệ, cài/chạy một bước, bản build, thao tác từng vai trò, SQLite/sao lưu, kiểm thử, giới hạn, xử lý lỗi và các bước tự đưa lên GitHub. Cập nhật đặc tả và `TEST_EXECUTION.md` theo ca mới.
- Kiểm kê trước khi dọn. Giữ các mẫu Word/Excel phục vụ bài tập, database và các thư mục build/cache đang được server sử dụng. Chỉ xóa hai ảnh cũ do dự án tạo trong `qa/` rồi bỏ thư mục rỗng, cùng `static/robots.txt` và `src/lib/index.ts` scaffold không dùng. Các ảnh cũ chỉ có thể phục hồi từ bản sao riêng nếu có; ảnh System test mới có thể tạo lại bằng `npm run test:system`.
- Bổ sung `.gitignore` cho database SQLite/WAL/SHM, build/cache, `node_modules`, `.env`, ảnh và kết quả test. Không xóa dữ liệu cục bộ. Chưa có Git repository trong thư mục, nên chưa thể kiểm tra staged files hoặc đẩy lên GitHub; README hướng dẫn người dùng `git init`, xem `git status --short` rồi mới commit.

Kiểm thử cuối G10: `npm run check` 0 lỗi/0 cảnh báo; `npm test` 19/19 đạt (6 Unit, 13 Integration); `npm run build` đạt; `npm run test:system` 6/6 đạt trên Chrome. Không tuyên bố đã kiểm thử tải lớn, đa trình duyệt, mọi nhánh quyền hoặc hoàn tất bảng báo cáo của thành viên phụ trách test.

Vấn đề còn mở: Nhóm cần tự tạo repository/remote GitHub và kiểm tra danh sách staged files; xác nhận yêu cầu giảng viên về ba bộ kiểm thử; hoàn thiện mẫu báo cáo, kiểm thử bổ sung và nhánh demo lỗi sau khi có mốc Git ổn định.
