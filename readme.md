# Design Patterns trong Nodejs
Bài viết đề cập cách áp dụng các design patterns trong cuốn sách Design Patterns: Elements of Reusable Object-Oriented Software (GoF) vào Nodejs
## Factory
Chúng ta sẽ bắt đầu với mẫu thiết kế phổ biến và đơn giản nhất: Factory
### Một interface chung để khởi tạo Object
Điều đầu tiên cần nói đến, factory cho phép tách biệt việc tạo và implement object.Một factory đóng gói việc tạo mới của một instance, giúp chúng ta có thể linh hoạt trong việc tạo đối tượng.

Xét ví dụ sau, đây là một factory đơn giản để tạo đối tượng Image
```js
   function createImage(name) {
     return new Image(name);
   }
   var image = createImage('photo.jpeg');
```
Việc viết thêm hàm createImage nhìn qua có thể thấy vô dụng, chúng ta hoàn toàn có thể khởi tạo trực tiếp:
```js
  var image = new Image(name);
```

Từ khoá "new" sẽ gắn code của chúng ta vào một loại Object cụ thể, ở đây là "Image".Nhưng khi sử dụng factory, chúng ta có thể linh hoạt hơn.Ví dụ, khi ta refactor lại class Image, chia thành class nhỏ hơn, mỗi một lớp image hỗ trợ một loại format khác nhau.Ta có thể viết như sau:
```js
function createImage(name) {
     if(name.match(/\.jpeg$/)) {
       return new JpegImage(name);
     } else if(name.match(/\.gif$/)) {
       return new GifImage(name);
     } else if(name.match(/\.png$/)) {
       return new PngImage(name);
     } else {
       throw new Exception('Unsupported format');
     }
 }
```
Ngoài ra, factory cũng cho phép việc không để lộ hàm khởi tạo và ngăn nó bị mở rộng hoặc sửa đổi.
### Cơ chế thực thi việc đóng gói
Trong JavaScript không có access level modifiers.Tất cả các biến được coi như Public.Như vậy cách duy nhất để tạo một biến Private là thông qua scope của một function.
```js
function factory(){
    const staff = {};
    const engineer = {
        getStaff: name => {
            if(!name) throw new Error('INVALID NAME');
            return staff[name];
        },
        setStaff: (name, value) => {
            if(!name) throw new Error('INVALID NAME');
            if(!value) throw new Error('INVALID VALUE');
            staff[name] = value;
        }
    }
    return engineer;
}

const engineer = factory();
engineer.setStaff('Khang', 'Dep trai');
console.log(engineer.getStaff('Khang')); //Dep trau
console.log(engineer.staff); //undefined
```
Ở đây staff sẽ được coi như biến Private, chỉ có thể truy cập qua getter, setter.

### Tạo một code profiler đơn giản
(Nôm na là phân tích hiệu suất)

Chúng ta sẽ viết một ví dụ hoàn chỉnh sử dụng một factory để xây dựng một code profiler đơn giản với các thuộc tính sau:
- Phương thức start() để bắt đầu session
- Phương thực end() kết thúc session và in ra thời gian thực thi.
Đầu tiên, tạo file profiler.js như sau:
```js
function Profiler(label) {
    this.label = label;
    this.lastTime = null;
}
  Profiler.prototype.start = function() {
    this.lastTime = process.hrtime();
}
  Profiler.prototype.end = function() {
    var diff = process.hrtime(this.lastTime);
    console.log('Timer "' + this.label + '" took '
    + diff[0] + ' seconds and '
    + diff[1] + ' nanoseconds.');
}
```
Ở đoạn mã trên, chúng ta đơn giản sử dụng bộ định thời gian bắt đầu chạy khi gọi hàm start() và kết thúc khi hàm end() được gọi.

Vấn đề hiện tại là khi chạy project trong một môi trường production thực sự, việc log ra các thông tin là rất tài nguyên.Để biết được những thông tin này ta thường lưu ở những nơi khác như database.

Vậy nên chúng ta cần wrap profiler trên lại trong một factory và custom lại nó.Nếu là môi trường develop thì in ra màn hình, còn nếu là production thì thực thi hành động khác.Thay vì export Profiler, ta sẽ export một factory như sau:
```js
 module.exports = function(label) {
     if(process.env.NODE_ENV === 'development') {
       return new Profiler(label);        //[1]
     } else if(process.env.NODE_ENV === 'production') {
       return {             //[2]
         start: function() {},
         end: function() {}
}
} else {
       throw new Error('Must set NODE_ENV');
     }
}
```
Factory trừu tượng hoá việc tạo ra profiler
- Nếu là môi trường develop, ta trả về object Profiler bình thường.
- Nếu là môi trường Production, ta trả về object với 2 hàm start() và end() customize tuỳ theo ta xử lý.

Giờ tạo file profilerTest.js để test như sau:

```js
var profiler = require('./profiler');
   function getRandomArray(len) {
     var p = profiler('Generating a ' + len + ' items long array');
     p.start();
     var arr = [];
     for(var i = 0; i < len; i++) {
       arr.push(Math.random());
     }
p.end(); }
   getRandomArray(1e6);
   console.log('Done');
```

Biến p chứa instance của Profiler object, nhưng chúng ta không biết nó được tạo và implement như thế nào.

Chạy chương trình với môi trường develop như sau

```sh
export NODE_ENV=development; node profilerTest
``` 

Môi trường product:

```sh
export NODE_ENV=production; node profilerTest
``` 