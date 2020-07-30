// A proxy is an object that controls access to another object, called subject.
// Both have identical interface and this allows us to transparently swap one for the other. 
// A proxy intercepts all or some of the operations that are meant to be executed on the subject,
//  modifying their behavior.
const createProxy = subject => ({
  // proxied method
  hello: () => `${subject.hello()} world`,
  // delegated method
  goodbye: () => subject.goodbye.apply(subject, arguments)
});
const foo = {
  hello: () => 'Hello foo',
  goodbye: () => 'Goodbye foo'
};
const proxy = createProxy(foo);
console.log(proxy.hello()) // Hello foo world
console.log(proxy.goodbye()); // Goobye foo