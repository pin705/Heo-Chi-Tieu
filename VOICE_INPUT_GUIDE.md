# Hướng dẫn sử dụng Nhập liệu bằng Giọng nói

## Tổng quan

Tính năng nhập liệu bằng giọng nói cho phép bạn thêm giao dịch thu/chi nhanh chóng bằng cách nói thay vì gõ phím. Hệ thống sẽ tự động nhận dạng số tiền, loại giao dịch (thu nhập hay chi tiêu), và ghi chú.

## Cách sử dụng

### Bước 1: Mở trang Thêm Giao dịch
1. Nhấn nút **+** (màu vàng) ở giữa thanh điều hướng dưới cùng
2. Tìm và nhấn nút **"Nhập bằng giọng nói"** (màu tím)

### Bước 2: Nói lệnh của bạn
1. Nhấn nút **microphone** để bắt đầu ghi âm
2. Nói rõ ràng câu lệnh của bạn
3. Hệ thống sẽ tự động dừng sau khi bạn nói xong
4. Hoặc nhấn lại nút để dừng thủ công

### Bước 3: Kiểm tra và lưu
1. Kiểm tra thông tin đã được điền tự động:
   - Số tiền
   - Loại giao dịch (Thu nhập/Chi tiêu)
   - Ghi chú
2. Điều chỉnh nếu cần (chọn danh mục, ví, ngày)
3. Nhấn **"Lưu giao dịch"**

## Cú pháp lệnh giọng nói

### Định dạng chung
```
[Loại giao dịch] [Số tiền] [Ghi chú]
```

### Loại giao dịch (tùy chọn)
- **Chi tiêu**: chi, chi tiêu, mua, trả, tiêu, tốn, phí
- **Thu nhập**: thu, thu nhập, nhận, lương, thưởng, được, kiếm, bán

*Lưu ý: Nếu không nói loại giao dịch, hệ thống mặc định là chi tiêu.*

### Số tiền

#### Cách 1: Số trực tiếp
```
50000         → 50,000 đ
35000         → 35,000 đ
2500000       → 2,500,000 đ
```

#### Cách 2: Sử dụng đơn vị rút gọn
```
50k           → 50,000 đ
35k           → 35,000 đ
2 triệu       → 2,000,000 đ
5tr           → 5,000,000 đ
1 tỷ          → 1,000,000,000 đ
```

#### Cách 3: Sử dụng từ số tiếng Việt
```
năm mươi nghìn     → 50,000 đ
hai trăm nghìn     → 200,000 đ
ba triệu           → 3,000,000 đ
```

### Đơn vị hỗ trợ
- **k** hoặc **ngàn/nghìn**: Nhân với 1,000
- **triệu** hoặc **tr**: Nhân với 1,000,000
- **tỷ**: Nhân với 1,000,000,000

## Ví dụ câu lệnh

### Chi tiêu

| Câu lệnh | Kết quả |
|----------|---------|
| "Chi 50000 ăn sáng" | Chi tiêu: 50,000đ<br>Ghi chú: "ăn sáng" |
| "Mua cafe 35k" | Chi tiêu: 35,000đ<br>Ghi chú: "mua cafe" |
| "Chi tiêu 200 ngàn đi chợ" | Chi tiêu: 200,000đ<br>Ghi chú: "đi chợ" |
| "Trả tiền điện 500k" | Chi tiêu: 500,000đ<br>Ghi chú: "tiền điện" |
| "Mua xăng 200000" | Chi tiêu: 200,000đ<br>Ghi chú: "mua xăng" |

### Thu nhập

| Câu lệnh | Kết quả |
|----------|---------|
| "Thu nhập 5 triệu lương tháng" | Thu nhập: 5,000,000đ<br>Ghi chú: "lương tháng" |
| "Nhận 500k thưởng" | Thu nhập: 500,000đ<br>Ghi chú: "thưởng" |
| "Lương 15 triệu" | Thu nhập: 15,000,000đ<br>Ghi chú: "lương" |
| "Bán đồ được 200k" | Thu nhập: 200,000đ<br>Ghi chú: "bán đồ" |

### Các trường hợp đặc biệt

| Câu lệnh | Kết quả |
|----------|---------|
| "50k cafe sáng" | Chi tiêu: 50,000đ<br>Ghi chú: "cafe sáng" |
| "2 triệu" | Chi tiêu: 2,000,000đ<br>Ghi chú: "" |
| "Ăn phở 40000 đồng" | Chi tiêu: 40,000đ<br>Ghi chú: "ăn phở" |

## Mẹo sử dụng hiệu quả

### 1. Nói rõ ràng và từ tốn
- Nói với tốc độ vừa phải
- Phát âm rõ ràng từng từ
- Tránh nói quá nhanh hoặc quá chậm

### 2. Môi trường yên tĩnh
- Sử dụng trong môi trường ít tiếng ồn
- Tránh nói khi có nhiều tiếng động xung quanh

### 3. Cấu trúc câu đơn giản
- Sử dụng cấu trúc ngắn gọn
- Tránh các câu phức tạp, dài dòng

### 4. Số tiền
- Ưu tiên sử dụng số và đơn vị (35k, 2 triệu)
- Tránh dùng dấu phẩy hay dấu chấm khi nói

### 5. Kiểm tra kết quả
- Luôn kiểm tra thông tin sau khi nhận dạng
- Điều chỉnh nếu hệ thống hiểu sai

## Xử lý sự cố

### Vấn đề: Microphone không hoạt động
**Giải pháp**:
1. Kiểm tra quyền truy cập microphone của ứng dụng
2. Đảm bảo không có ứng dụng nào khác đang sử dụng microphone
3. Khởi động lại ứng dụng

### Vấn đề: Số tiền nhận dạng sai
**Giải pháp**:
1. Nói rõ ràng hơn số tiền
2. Sử dụng đơn vị rút gọn (k, triệu, tỷ)
3. Thử nói số trực tiếp thay vì từ số

### Vấn đề: Loại giao dịch bị sai
**Giải pháp**:
1. Nói rõ từ khóa "chi tiêu" hoặc "thu nhập" ở đầu câu
2. Sử dụng động từ cụ thể (mua, trả cho chi tiêu; nhận, kiếm cho thu nhập)

### Vấn đề: Trình duyệt không hỗ trợ
**Thông báo**: "Trình duyệt không hỗ trợ nhận dạng giọng nói"

**Giải pháp**:
- Sử dụng trình duyệt Chrome, Edge, hoặc Safari (phiên bản mới nhất)
- Cập nhật Zalo lên phiên bản mới nhất

## Giới hạn

- **Số tiền tối đa**: 1,000,000,000 đồng (1 tỷ)
- **Số tiền tối thiểu**: 1 đồng
- **Ngôn ngữ**: Chỉ hỗ trợ tiếng Việt
- **Độ dài ghi chú**: Không giới hạn, nhưng nên giữ ngắn gọn

## Bảo mật & Quyền riêng tư

- **Không lưu trữ âm thanh**: Ứng dụng không lưu trữ hoặc gửi file âm thanh của bạn
- **Xử lý local**: Tất cả nhận dạng giọng nói được xử lý bởi trình duyệt/thiết bị
- **Không chia sẻ**: Dữ liệu giọng nói không được chia sẻ với bất kỳ bên thứ ba nào

## Yêu cầu hệ thống

- **Trình duyệt**: Chrome 25+, Edge 79+, Safari 14.1+
- **Hệ điều hành**: Android 5+, iOS 14.3+
- **Kết nối Internet**: Cần thiết cho nhận dạng giọng nói
- **Microphone**: Yêu cầu thiết bị có microphone hoạt động

## Hỗ trợ

Nếu bạn gặp vấn đề với tính năng nhập liệu bằng giọng nói:
1. Kiểm tra phiên bản ứng dụng
2. Kiểm tra quyền truy cập microphone
3. Thử khởi động lại ứng dụng
4. Liên hệ bộ phận hỗ trợ nếu vấn đề vẫn tiếp diễn

---

*Phiên bản: 1.0 | Cập nhật: Tháng 12, 2025*
