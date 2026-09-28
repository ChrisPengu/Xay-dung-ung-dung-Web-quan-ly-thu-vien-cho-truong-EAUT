# Kế hoạch dự án EAUT Library

Ngày khởi tạo: 2026-09-28  
Trạng thái: Bản kế hoạch 0.5, bổ sung tài khoản trình bày và chuẩn bị đưa lên GitHub.

## 1. Mục tiêu

Xây dựng ứng dụng web quản lý thư viện cho Trường Đại học Công nghệ Đông Á (EAUT), phục vụ đồng thời hai mục đích:

1. Có thể sử dụng để mô phỏng công việc thư viện thực tế: tra cứu tài liệu, quản lý đầu sách và bản sách, đăng ký độc giả, mượn, trả và theo dõi quá hạn.
2. Là hệ thống được kiểm thử có phương pháp cho BTL học phần Kiểm thử phần mềm: yêu cầu rõ ràng, dữ liệu test tái lập, test case ở nhiều mức, kết quả thực thi, lỗi được theo dõi và automation test.

Kế hoạch này chỉ áp dụng cho thư mục dự án EAUT. Không dùng tài liệu, database, tiến trình hay nhật ký của dự án DocuCatalog làm trạng thái của dự án này.

## 2. Nguyên tắc triển khai

- Bắt đầu mỗi phiên làm việc bằng việc đọc `PROJECT_PLAN.md` và `DEVELOPMENT_LOG.md`, xác nhận thư mục gốc EAUT, xem mục tiêu đang làm và các vấn đề chưa giải quyết.
- Hoàn thành một mục tiêu thì cập nhật trạng thái trong kế hoạch và ghi ngay vào nhật ký: thời gian, việc đã làm, tệp thay đổi, lệnh và kết quả kiểm thử, lỗi còn tồn tại, bước kế tiếp.
- Chỉ đánh dấu mục tiêu hoàn thành khi tiêu chí nghiệm thu và bằng chứng kiểm thử của mục tiêu đó đã đạt.
- Ưu tiên chức năng lõi có thể kiểm thử kỹ. Mọi thay đổi phạm vi phải được ghi lý do, ảnh hưởng tới lịch trình và test case.
- Dữ liệu demo và dữ liệu test tách khỏi dữ liệu vận hành. Không đặt mật khẩu thật trong mã nguồn hay Git.
- Tài sản nhận diện EAUT và nội dung thể chế chỉ dùng sau khi đối chiếu nguồn chính thức hoặc tài liệu người dùng cung cấp.

## 3. Phạm vi nghiệp vụ dự kiến

### Vai trò

| Vai trò | Công việc |
| --- | --- |
| Quản trị viên | Quản lý tài khoản, vai trò, cấu hình chính sách mượn và xem thống kê |
| Thủ thư | Quản lý đầu sách và bản sách, duyệt độc giả, lập phiếu mượn, trả sách, xử lý sách hỏng hoặc mất |
| Độc giả EAUT | Tra cứu sách, xem tình trạng còn sách, lịch sử mượn và hạn trả của bản thân |

Ở bản trình bày, thủ thư tạo tài khoản độc giả bằng mã nội bộ hoặc mã sinh viên. Chưa tích hợp xác minh người học hay hệ thống tài khoản EAUT thật. Không tự cấp quyền thủ thư hay quản trị.

### Chức năng bắt buộc cho bản đầu

- Đăng nhập, đăng xuất, phân quyền và quản lý hồ sơ.
- Danh mục sách: ISBN hoặc mã nội bộ, nhan đề, tác giả, thể loại, nhà xuất bản, năm xuất bản, mô tả, ảnh bìa nếu cần.
- Bản sách vật lý: mã cá biệt duy nhất, vị trí, tình trạng và trạng thái sẵn có/đang mượn/hỏng/mất.
- Tra cứu, lọc và xem chi tiết sách.
- Quản lý độc giả và trạng thái tài khoản.
- Mượn, trả, gia hạn theo quy tắc rõ ràng; tính hạn trả và hiển thị quá hạn.
- Trang tổng quan cho thủ thư với số đầu sách, bản sách, phiếu đang mượn và quá hạn.
- Dữ liệu mẫu và hướng dẫn chạy trên máy khác.

### Chức năng có thể bổ sung sau khi lõi ổn định

Giữ chỗ sách, nhắc hạn bằng email, nhập/xuất Excel, mã vạch, phí phạt, nhiều cơ sở thư viện, tích hợp SSO EAUT. Những mục này chưa thuộc tiêu chí hoàn thành bản đầu vì cần thêm chính sách nghiệp vụ và hạ tầng.

### Quy tắc nghiệp vụ cần đặc tả thành test

- Một bản sách chỉ có tối đa một phiếu mượn đang mở.
- Không cho mượn bản sách hỏng, mất hoặc đã được mượn.
- Một độc giả bị khóa không được mượn hoặc gia hạn.
- Ngày trả dự kiến phải sau ngày mượn; gia hạn chỉ hợp lệ khi phiếu chưa trả và thỏa chính sách.
- Trả sách chỉ cập nhật đúng một lần; phải ngăn thao tác trả lặp.
- Xóa đầu sách hoặc độc giả có lịch sử phải có quy tắc bảo toàn dữ liệu.
- Mã cá biệt, mã độc giả và tên đăng nhập là duy nhất.

Chính sách mẫu đã chốt cho BTL: tối đa 5 bản đang mượn, hạn 14 ngày, gia hạn tối đa 1 lần thêm 14 ngày. Chi tiết và các giả định nằm trong `REQUIREMENTS_AND_TEST_PLAN.md`.

## 4. Công nghệ đang dùng

Theo ưu tiên mới của người dùng, sản phẩm dùng SvelteKit, Svelte 5 và TypeScript cho cả giao diện lẫn server. Node.js 24 cung cấp SQLite tích hợp để chạy demo trên một máy, không cần cài MySQL. Dữ liệu mặc định nằm ở `data/eaut-library.sqlite`; test dùng SQLite trong bộ nhớ. Giao diện tự viết CSS responsive và dùng icon Lucide.

Ba bộ kiểm thử theo mẫu môn học: Unit (Vitest), Integration (Vitest + SQLite trong bộ nhớ), System (Playwright + Chrome cài sẵn). Đây là ba cấp kiểm thử; chưa coi chúng là ba công cụ bắt buộc. Cần xác nhận lại với giảng viên nếu cách hiểu khác. Phiên bản thực tế được khóa trong `package-lock.json`.

## 5. Các mục tiêu và tiêu chí hoàn thành

### G0 - Xác lập dự án và kế hoạch

Trạng thái: **Hoàn thành**

- Xác nhận thư mục EAUT riêng, kiểm kê tệp hiện có.
- Đọc mẫu báo cáo BTL và ánh xạ yêu cầu báo cáo vào kế hoạch.
- Tạo kế hoạch và nhật ký riêng.

Bằng chứng: hai tệp Markdown hiện diện trong thư mục EAUT, nhật ký có mục G0.

### G1 - Chốt yêu cầu và thiết kế kiểm thử

Trạng thái: **Hoàn thành bản đặc tả tối thiểu**, 2026-09-28.

- Đã viết `REQUIREMENTS_AND_TEST_PLAN.md`: vai trò, luồng E2E, 12 yêu cầu có mã (sau G9), chính sách mẫu, trường dữ liệu và ma trận Unit/Integration/System.
- Bản phác màn hình được thay bằng giao diện thật; sơ đồ dữ liệu và bảng test case đầy đủ theo mẫu Excel chuyển sang G7 để thành viên phụ trách kiểm thử mở rộng.

Tiêu chí đạt: mỗi yêu cầu lõi có tiêu chí nghiệm thu và test dự kiến; các giả định không phải quy định EAUT được ghi rõ.

### G2 - Khởi tạo ứng dụng và môi trường

Trạng thái: **Hoàn thành**, 2026-09-28.

- Tạo SvelteKit TypeScript độc lập với dự án cũ, khóa dependency bằng npm.
- Khởi tạo SQLite tự động, dữ liệu demo khi database mới; System test dùng database trong bộ nhớ.
- Kiểm tra `npm run check`, `npm test`, `npm run build` và khởi động bản build trên localhost.

Đạt: README có lệnh cài/chạy/test, website build và chạy HTTP trên localhost; `npm test` và System test dùng database trong bộ nhớ đều xanh.

### G3 - Tài khoản và phân quyền

Trạng thái: Hoàn thành phần lõi để trình bày; mở rộng quản trị tài khoản ở lượt sau.

- Đã làm đăng nhập/đăng xuất, mật khẩu scrypt, cookie phiên HttpOnly, form cùng nguồn, hồ sơ và đổi mật khẩu.
- Đã phân quyền quản trị/thủ thư/độc giả; ST-03 xác nhận độc giả bị chặn khỏi trang thủ thư.
- Đã bổ sung khóa/mở độc giả ở G9. Còn mở: quy trình khởi tạo quản trị không dùng demo seed và kiểm tra bảo mật chuyên sâu.

Tiêu chí phần lõi: độc giả chỉ thấy dữ liệu mượn của mình; thủ thư truy cập được nghiệp vụ; truy cập trái quyền bị HTTP 403.

### G4 - Danh mục và bản sách

Trạng thái: Hoàn thành phần lõi để trình bày.

- Đã làm thêm/sửa/lưu trữ mềm đầu sách, thêm bản sách, tra cứu/lọc/xem chi tiết; mã sách, ISBN và mã cá biệt duy nhất.
- Tác giả, thể loại, nhà xuất bản là trường trên đầu sách, chưa là module CRUD riêng. Sửa tình trạng bản sách đã bổ sung ở G9; phân trang để sau nếu cần.
- IT-04 và ST-01/ST-02 kiểm tra các luồng chính.

Hoàn thành khi thủ thư quản lý được sách và độc giả tra cứu được tình trạng thực tế.

### G5 - Mượn, trả, gia hạn và quá hạn

Trạng thái: Hoàn thành phần lõi để trình bày.

- Trạng thái bản sách chuyển cùng phiếu trong giao dịch SQLite; unique index ngăn hai phiếu mở cùng một bản.
- Chính sách 5 bản / 14 ngày / 1 lần gia hạn và từ chối quá hạn, khóa tài khoản, trả lặp.
- UT, IT và ST-02 đã chạy; kiểm thử đồng thời bằng nhiều tiến trình còn để mở rộng.

Hoàn thành khi không thể tạo trạng thái mâu thuẫn qua UI, service hoặc request gửi trực tiếp.

### G6 - Giao diện và trải nghiệm

Trạng thái: Hoàn thành phần lõi trình bày, 2026-09-28; đã xem kho sách ở desktop/mobile, dashboard desktop và ST-04 xác nhận màn hình 390px không cuộn ngang. Rà soát accessibility toàn diện vẫn thuộc G8.

- Dùng ngôn ngữ tiếng Việt phù hợp môi trường EAUT, responsive, thao tác bàn phím và thông báo dễ hiểu.
- Bám nhận diện đã kiểm chứng; không dùng asset không rõ giấy phép.
- Kiểm tra các trang chính trên desktop và mobile, tương phản, focus, nhãn form và trạng thái rỗng.

Hoàn thành khi các luồng chính dùng được trên màn hình nhỏ và không có lỗi bố cục nghiêm trọng.

### G7 - Bộ kiểm thử và bằng chứng BTL

Trạng thái: Đang làm; đã có bộ Unit, Integration, System tự động làm nền cho thành viên phụ trách test.

- Lập bảng test case có ID, mục tiêu, dữ liệu, bước, kết quả mong đợi và kết quả thực tế.
- Thực thi Unit/Integration bằng Vitest, System bằng Playwright; lưu kết quả chạy thật và ảnh/trace khi cần.
- Ghi lỗi với bước tái hiện, mức độ, trạng thái và commit sửa.
- Đối chiếu ma trận `REQ -> TEST -> RESULT -> EVIDENCE`.
- Có kịch bản chạy lại từ đầu trên máy khác.

Hoàn thành khi báo cáo phân biệt số case đã chạy/đạt/lỗi/bỏ qua, có bằng chứng cho từng nhóm kiểm thử và không che giấu lỗi còn tồn tại.

### G8 - Tài liệu, bàn giao và rà soát cuối

Trạng thái: Đang làm; README hướng dẫn chạy đã có, báo cáo BTL còn cần nhóm hoàn thiện.

- Hoàn thiện README về Node.js, demo, SQLite, tài khoản mẫu, kiểm thử và sao lưu.
- Kiểm tra bản build sạch và test trên môi trường dự kiến trình bày.
- Chuẩn bị nội dung báo cáo theo mẫu trong thư mục: Chương 1 đến 4, kết luận, phụ lục và tài liệu tham khảo.
- Ghi rõ giới hạn thực tế và hướng phát triển.

Hoàn thành khi người khác có thể làm theo README để chạy và tái hiện các test chính.

## 6. Liên hệ với mẫu báo cáo BTL

| Phần trong mẫu | Sản phẩm/bằng chứng cần chuẩn bị |
| --- | --- |
| Chương 1 - Tổng quan và đặc tả | Bối cảnh, vai trò, use case E2E, wireframe, từ điển trường, ràng buộc và module input/output |
| Chương 2 - Thiết kế test | Kỹ thuật phân lớp tương đương, giá trị biên, bảng quyết định, chuyển trạng thái; test case unit/integration/system |
| Chương 3 - Thực thi test | Kết quả chạy thật, bảng pass/fail, lỗi có bước tái hiện, severity và trạng thái |
| Chương 4 - Automation | Công cụ, môi trường, kịch bản tự động, log/ảnh, tỷ lệ tự động và thời gian chạy |
| Kết luận/phụ lục | Kết quả, hạn chế, hướng phát triển, dữ liệu test và tài liệu tham khảo |

Mẫu Word là khung báo cáo, không phải đặc tả nghiệp vụ đã được xác nhận. Các chính sách thư viện phải được ghi thành quyết định riêng ở G1.

## 7. Cách cập nhật kế hoạch

- Mỗi mục tiêu có trạng thái: Chưa bắt đầu, Đang làm, Hoàn thành hoặc Tạm dừng.
- Nếu phát sinh yêu cầu mới, ghi thay đổi ở mục tiêu liên quan và trong nhật ký trước khi triển khai.
- Khi một mục tiêu hoàn thành, ghi ngày hoàn thành, bằng chứng, số test đạt và vấn đề còn mở.
- Trước lượt làm việc tiếp theo, đọc lại cả hai tệp này rồi mới sửa mã nguồn.

## 8. Việc cần xác nhận trước khi nộp

- Giảng viên nói ba **bộ/cấp kiểm thử** Unit, Integration, System như mẫu Word hay yêu cầu ba **công cụ** khác nhau? Nếu là ba công cụ, thêm công cụ thứ ba và bằng chứng tương ứng.
- Buổi trình bày dùng máy Windows có Node.js 24 và Chrome hay cần đóng gói để chạy trên máy khác?
- Nhóm có quy định mượn/trả chính thức, nhu cầu phí phạt/giữ chỗ hoặc SSO EAUT thật không? Hiện website dùng chính sách và tài khoản demo.
- Thành viên phụ trách test cần bổ sung bảng test case Excel, báo cáo defect và các Chương 2-4; không ghi Pass cho ca chưa chạy.

## 9. Demo lỗi có kiểm soát

Sau khi có mốc Git ổn định, tạo nhánh `demo/bug-loan-limit` chứa duy nhất sai lệch điều kiện giới hạn mượn ở biên 5 bản, theo `REQUIREMENTS_AND_TEST_PLAN.md`. Chạy Unit test để thấy đỏ, sửa một ký tự và chạy lại xanh. Không tạo lỗi trên nhánh bàn giao; không dùng dữ liệu thật.

## 10. G9 - Quản trị thư viện và nhận diện EAUT

Trạng thái: Hoàn thành phần lõi, 2026-09-28. Ưu tiên lại từ trải nghiệm tra cứu sang công việc quản lý hằng ngày; các nghiệp vụ nâng cao vẫn để G7/G8 hoặc mốc sau.

- Quản lý bản sách: thủ thư sửa vị trí kệ, tình trạng tốt/hỏng/mất; từ chối sửa bản đang mượn, giữ trạng thái sẵn có đồng bộ với tình trạng.
- Quản lý độc giả: tìm theo mã/tên/email, khóa/mở tài khoản; chặn mượn/gia hạn khi khóa nhưng giữ lịch sử và cho trả sách.
- Trang thủ thư ưu tiên bảng dữ liệu và thao tác trực tiếp; dashboard có lối vào các việc quản lý, còn trang khách vẫn dễ tra cứu.
- Dùng logo tải từ `https://eaut.edu.vn/wp-content/uploads/2018/11/logo-1.png` trên website chính thức, không vẽ lại hoặc đổi màu logo. Giao diện lấy xanh EAUT làm chủ đạo nhưng ghi rõ đây là bản demo học tập, không đại diện hệ thống trường.
- Tạo lệnh chạy một bước cho Windows: kiểm tra Node 24, cài dependency nếu thiếu, khởi động và mở trình duyệt. Giữ hướng dẫn CLI để chạy trên hệ điều hành khác.
- Bổ sung Unit/Integration/System test phù hợp, rà lại build, kiểm tra desktop/mobile và cập nhật README/nhật ký.

Nguồn tham khảo nghiệp vụ: [Koha Community - Cataloging](https://github.com/Koha-Community/kohadocs/blob/master/source/cataloging.rst), [Koha Community - Patrons](https://github.com/Koha-Community/kohadocs/blob/master/source/patrons.rst), [FOLIO - Users](https://docs.folio.org/docs/users/). Chỉ học mô hình nghiệp vụ, không sao chép mã hay giao diện.

Hoàn thành khi thủ thư quản lý được tình trạng bản sách và trạng thái độc giả qua giao diện, quy tắc chặn được test, giao diện dùng logo EAUT đúng nguồn và người dùng Windows mở web bằng một lệnh/tệp.

## 11. G10 - Tài khoản trình bày và gói bàn giao GitHub

Trạng thái: Hoàn thành, 2026-09-28.

- Đổi ba tài khoản demo hiện có thành admin Vũ Mười, thủ thư Bá Hiếu và độc giả Qang Minh; không tạo thêm tài khoản admin mật khẩu demo không cần thiết. Dữ liệu đã tạo trước chỉ đổi khi mã, tên và email vẫn khớp bản seed cũ; không ghi đè tài khoản tùy chỉnh.
- Cập nhật login, README và System test theo email mới. Kiểm tra đăng nhập cả ba vai trò và bảo toàn dữ liệu demo hiện có.
- Mở rộng README thành tài liệu giới thiệu, lệnh cài/chạy/test, thao tác theo từng vai trò, database, lỗi thường gặp và quy trình đưa lên GitHub.
- Kiểm kê tệp trước khi dọn. Giữ mẫu Word/Excel liên quan BTL và database cá nhân; loại bỏ chỉ tệp QA cũ do dự án tạo, bổ sung quy tắc ignore cho cache/build, database, môi trường và bằng chứng sinh tự động.
- Chạy lại check, unit/integration, build và System test; ghi kết quả và giới hạn thật.

Hoàn thành khi người khác có thể clone/chạy theo README, tài khoản demo mới hoạt động, bộ test xanh và danh sách tệp đưa lên GitHub không chứa dữ liệu cục bộ.

Kết quả G10: Ba tài khoản demo dùng tên/email mới; migration chỉ sửa dòng vẫn khớp dữ liệu mẫu cũ và có ca hồi quy bảo vệ tài khoản tùy chỉnh. README bao phủ cài đặt, luồng thao tác, SQLite, kiểm thử, giới hạn và GitHub. `.gitignore` loại trừ database, dependency, build, môi trường và bằng chứng tự sinh; mẫu Word/Excel được giữ. Đã dọn hai ảnh QA cũ, `static/robots.txt` và `src/lib/index.ts` không dùng. `npm run check` 0 lỗi/0 cảnh báo, `npm test` 19/19 đạt, `npm run build` đạt, `npm run test:system` 6/6 đạt. Thư mục chưa khởi tạo Git hoặc đẩy GitHub; người dùng thực hiện theo README sau khi chọn repository.
