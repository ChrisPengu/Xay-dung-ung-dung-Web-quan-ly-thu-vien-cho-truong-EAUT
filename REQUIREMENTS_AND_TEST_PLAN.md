# Đặc tả ngắn và kế hoạch kiểm thử EAUT Library

Tài liệu này chốt phạm vi cho bản website trình bày môn Kiểm thử phần mềm. Các chính sách bên dưới là **giả định của nhóm để làm BTL**, không phải quy định chính thức của thư viện EAUT. Nếu giảng viên đưa chính sách khác, sửa đặc tả trước rồi cập nhật mã và test tương ứng.

## 1. Vai trò và luồng sử dụng

| Vai trò | Có thể làm |
| --- | --- |
| Khách | Xem, tìm kiếm, lọc và xem chi tiết sách |
| Độc giả | Làm mọi việc của khách; đăng nhập, xem sách đang và đã mượn, sửa hồ sơ, đổi mật khẩu |
| Thủ thư | Quản lý đầu sách và bản sách, tạo tài khoản độc giả, lập phiếu mượn, trả, gia hạn |
| Quản trị | Các quyền thủ thư; phần cấu hình nâng cao sẽ làm khi thật sự cần cho BTL |

Luồng E2E để trình bày: thủ thư đăng nhập -> thêm đầu sách -> thêm bản vật lý -> tạo độc giả -> lập phiếu mượn -> xem hạn trả -> gia hạn hoặc trả -> xác nhận bản sách lại sẵn có. Luồng độc giả: tìm sách -> đăng nhập -> xem sách của mình và hồ sơ.

## 2. Yêu cầu có thể kiểm thử

| ID | Yêu cầu và tiêu chí nghiệm thu | Kiểm thử tối thiểu |
| --- | --- | --- |
| REQ-01 | Khách xem và tìm sách theo tên, tác giả, mã hoặc ISBN; lọc theo thể loại; không thấy sách đã lưu trữ | ST-01 |
| REQ-02 | Tài khoản hợp lệ đăng nhập/đăng xuất; sai mật khẩu không tạo phiên; độc giả bị chặn khỏi trang/thao tác thủ thư | ST-03, ST-06 |
| REQ-03 | Thủ thư thêm, sửa, lưu trữ đầu sách. Mã sách là duy nhất; đầu sách còn phiếu mở không được lưu trữ | IT-04, ST-02 |
| REQ-04 | Mỗi bản sách có mã cá biệt duy nhất, vị trí kệ và trạng thái còn/đang mượn | IT-01, ST-02 |
| REQ-05 | Thủ thư tạo độc giả với mã/email duy nhất; độc giả chỉ thấy lịch sử mượn của chính mình | ST-02, ST-03 |
| REQ-06 | Chỉ cho mượn bản tốt đang sẵn có; một bản có tối đa một phiếu mượn mở; thao tác mượn và cập nhật bản sách cùng một giao dịch | IT-01, IT-02 |
| REQ-07 | Độc giả đang hoạt động mượn tối đa 5 bản; đang có sách quá hạn hoặc bị khóa thì không được mượn tiếp | UT-02, IT-03 |
| REQ-08 | Hạn trả mặc định 14 ngày sau ngày mượn; thời điểm bằng hạn chưa quá hạn, sau hạn là quá hạn | UT-01 |
| REQ-09 | Phiếu chưa trả và chưa quá hạn được gia hạn tối đa một lần, thêm 14 ngày; trả lặp bị từ chối | UT-03, IT-01 |
| REQ-10 | Dashboard hiển thị số đầu sách, bản còn, phiếu mở; form có nhãn, lỗi dễ hiểu, dùng được trên desktop/mobile | ST-02, ST-04 |
| REQ-11 | Thủ thư sửa vị trí và tình trạng từng bản; bản hỏng/mất không cho mượn, bản đang mượn không được sửa tình trạng | IT-05, ST-05 |
| REQ-12 | Thủ thư tìm, khóa/mở độc giả; khóa chặn mượn/gia hạn nhưng vẫn nhận trả, giữ lịch sử; tài khoản tạo mới dùng email EAUT | UT-04, IT-06, ST-05 |

## 3. Dữ liệu và ranh giới nghiệp vụ

- Đầu sách khác bản sách: một đầu sách có nhiều bản; mỗi bản có một mã cá biệt duy nhất.
- Phiếu mượn gắn với **một bản sách** và **một độc giả**. Một bản chỉ có một phiếu chưa trả; database có unique index cho điều này.
- Không xóa cứng đầu sách đã có quan hệ; thao tác xóa trên giao diện là lưu trữ mềm. Nếu còn phiếu đang mở, từ chối lưu trữ.
- Tài khoản demo do ứng dụng tạo khi database mới, dùng duy nhất cho trình bày/thử nghiệm. Chưa kết nối tài khoản thật hoặc SSO của EAUT.
- SQLite lưu ở `data/eaut-library.sqlite` theo mặc định; System test dùng `:memory:` nên không làm bẩn dữ liệu demo.
- Form sách: mã 3-32 ký tự, tên 2-200, tác giả 2-120, thể loại tối đa 80, năm 1450 đến năm hiện tại + 1, ISBN nếu có gồm 10-17 chữ số/dấu gạch ngang.
- Form độc giả: mã 4-24 ký tự, tên 2-100, email `@eaut.edu.vn` hợp lệ, mật khẩu tối thiểu 8 ký tự. Bản demo không gửi email xác minh.

## 4. Ba bộ kiểm thử theo mẫu của môn học

Mẫu Word nêu rõ Chương 2 cần Unit, Integration và System Test Case; thư mục gốc cũng có mẫu bảng tính cho cả ba. Đây là ba **cấp/bộ kiểm thử**, không phải yêu cầu phải dùng ba công cụ khác nhau. Thành viên phụ trách test có thể điền thêm các trường của mẫu Excel.

| Bộ | Công cụ hiện dùng | Ca đã tự động hóa | Ca nên bổ sung |
| --- | --- | --- | --- |
| Unit Test | Vitest | UT-01 hạn trả và biên quá hạn; UT-02 giới hạn mượn; UT-03 điều kiện gia hạn; UT-04 email EAUT | Phân lớp tương đương cho mã sách, năm xuất bản, tài khoản |
| Integration Test | Vitest + SQLite trong bộ nhớ | IT-01 mượn/trả cập nhật 2 bảng; IT-02 chặn mượn trùng; IT-03 chặn độc giả quá hạn; IT-04 thêm/sửa/lưu trữ sách; IT-05 tình trạng bản sách; IT-06 khóa/mở độc giả | Kiểm tra đồng thời, lỗi database và rollback |
| System Test | Playwright + Google Chrome | ST-01 tìm kiếm/lọc; ST-02 thêm sách -> bản -> độc giả -> mượn -> trả; ST-03 phân quyền; ST-04 mobile kho sách; ST-05 quản lý bản sách và độc giả; ST-06 admin Vũ Mười đăng nhập | Kiểm thử bàn phím, thông báo lỗi và ma trận quyền chi tiết hơn |

Khi ghi kết quả vào bảng của nhóm, mỗi ca cần ID, tiền điều kiện, dữ liệu, bước làm, kết quả mong đợi, kết quả thực tế, trạng thái Pass/Fail/Untested/N/A, ngày chạy và bằng chứng. Không điền Pass cho ca chưa chạy. Mẫu Unit Test Case.xls hiện có ô công thức `#REF!`; chỉ dùng làm gợi ý bố cục, không sao chép số liệu tổng hợp lỗi.

## 5. Demo phát hiện và sửa lỗi

Giữ bản website chính luôn đúng. Sau khi chốt một bản ổn định, tạo một nhánh Git riêng `demo/bug-loan-limit` với **một sai lệch duy nhất**: đổi điều kiện giới hạn mượn từ `activeCount >= MAX_ACTIVE_LOANS` thành `activeCount > MAX_ACTIVE_LOANS`. Bộ UT-02 sẽ đỏ ở đúng biên 5 bản; khôi phục ký tự `=` thì test xanh. Có thể mở thêm IT để minh họa ảnh hưởng tới nghiệp vụ.

Nhánh lỗi chỉ dùng offline với database trong bộ nhớ. Không demo lỗi đăng nhập, phân quyền hay thao tác gây mất dữ liệu. Sau buổi trình bày, checkout nhánh chính đã sửa; không để phiên bản lỗi làm bản bàn giao.

## 6. Phần còn mở

- Xác nhận giảng viên hiểu yêu cầu ba bộ là Unit/Integration/System đúng như mẫu Word; nếu giảng viên muốn ba **công cụ** riêng, bổ sung JMeter hoặc Postman vào kế hoạch trước khi nộp.
- Chưa có quy định chính thức EAUT về số ngày/số bản được mượn, phí phạt, đặt trước và SSO; không quảng bá đây là hệ thống chính thức.
- Thành viên phụ trách test sẽ mở rộng ca, điền bảng Excel và làm Chương 2-4 của báo cáo dựa trên bằng chứng chạy thật.
