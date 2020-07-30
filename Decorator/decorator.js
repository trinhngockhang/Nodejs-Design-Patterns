// Gan giong proxy
// Cach cai dat co the giong, nhung muc dich cua decorator la them va sua
// Con proxy co muc dich la kiem soat truy cap object
const User = function(name) {
    this.name = name;
    this.say = function() {
        console.log(`User: ${this.name}`);
    };
};

const DecoratedUser = function(user, address, city) {
    this.user = user;
    this.name = user.name;
    this.address = address;
    this.city = city;

    this.say = function(){
        console.log(`Decorated User: ${this.name}, ${this.address}, ${this.city}`);
   };
};

const user = new User('Khang Khang');
user.say(); //User: Eli Manning
const decorated = new DecoratedUser(user, 'Le Trong Tan', 'Ha Noi');
decorated.say(); 