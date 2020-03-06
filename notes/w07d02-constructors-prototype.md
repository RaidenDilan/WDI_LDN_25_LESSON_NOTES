---
title: Constructors and Prototypes
type: lesson
duration: "1:25"
creator:
    name: Alex Chin
    city: London
competencies: Programming
---

# Constructors and Prototypes

### Objectives
*After this lesson, students will be able to:*

- Compare JS prototypes with Ruby classes
- Identify the properties that are inherited by an object's prototype
- Use the `new ` operator with one or more arguments to set initial properties on a newly-constrcuted object
### Preparation
- Specify a new object's prototype using the `Object.create` method
- Describe the prototype inheritance chain

*Before this lesson, students should already be able to:*

- Write JavaScript functions
- Describe the difference between functions and methods in JavaScript
- Describe how functions work with variables in JavaScript

## Object Orientated Programming in Javascript - Intro (5 mins)

A while back we practiced creating JavaScript objects; last week unit we dove into Ruby and practiced a lot with Ruby objects and classes; so now, it's time we turn our attention to "object oriented programming" in JavaScript.  We'll be exploring what a `Class` means in JavaScript and of course, define and instantiate classes.

#### Review

Remember, when we talk about classes in Object Oriented Programming, we're describing a way of organizing your code and schema to model real world problems and data structures in our applications.  In essence, We use classes to "model" the world around us.

But, technically speaking, there are no classes in JavaScript - that's because even though JavaScript is object-oriented, it is not a class-based language. Rather, let's describe it as [prototype-based](https://en.wikipedia.org/wiki/Prototype-based_programming). But, we can use JavaScript just like we're used to - as a class-based language - if we think of the constructor functions like classes, like so many people do.

> Note: Explain the difference between prototypical inheritance, not classical inheritance.

#### Syntax to create an Object - Demo (15 mins)

The syntax for creating Objects in Javascript comes in two forms:

- the **declarative (literal)** form
- and the **constructed** form

The literal syntax for an object looks like this:

```javascript
var myObj = {
  key: value
};
```

The constructed form looks like this:

```javascript
var myObj = new Object();
myObj.key = value;
```

#### What is a constructor function?

A constructor is any Javascript function that is used to return a new object. The language doesn’t make a distinction. A function can be written to be used as a constructor or to be called as a normal function, or to be used either way.

If we wanted to simulate a class in JavaScript:

```javascript
function Person(name){
  this.name = name;
}
```

#### What about the `new` operator?

The [`new`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new) operator in Javascript creates a new instance of a user-defined object type or of one of the built-in object types that has a constructor function.

Now that we have a constructor function, we can use the `new` operator to create a `Person`:

```javascript
var jenny = new Person('Jenny');
// undefined
```

To be sure `jenny` is infact a `Person`, we can:

```javascript
jenny instanceof Person;
// true
```

#### Assign with `var`

You could also call `Person` as a normal function - without the new:

```javascript
Person('Jenny')
// undefined
```

However, the `this` value inside the constructor would point to the `window` object and therefore would create a global variable called `name`:

```javascript
window.name
// "Jenny"
```

But global variables are dangerous and we can prvent it by writing something like this:

```javascript
function Person(name){
  if (!(this instanceof Person)) {  
    return new Person(name);
  }
  this.name = name;
}

Person("Alex")
// Person {name: "Alex"}
```

Let's what through this line by line:

- First, this checks to see if `this` is a Person - which it would be if called using new
- Then, if it is a Person, we'll carry on to the third line
- But if what's being passed into this function is not a Person, we'll use `new` to create a new Person and then return it.

It is much easier, however, to remember: always assign an object to a variable with `var`!


## Literal vs Constructor Notation - Codealong (15 mins)

Okay - if we can use both literal and constructor syntax to create objects, what should we use and when should we use it? Honestly, they're one in the same. The key difference being when you need multiple instances of your object:

- An object defined with a constructor allows for multiple instances of the object, whereas, object literals can be thought of as
- Object literals are basically singletons with public variables/methods

  -  _"The Singleton Pattern limits the number of instances of a particular object to just one. This single instance is called the singleton."_ - dofactory.com:

If we created a person with the literal notation:

```javascript
var Person = {
  name: "alex",
}

Person
// Object {name: "alex"}
```

To create another Person, we would need to type this code out again. Or we could use a constructor and do:

```javascript
function Person(name){
  this.name = name;
}

var person1 = new Person("Dave");
var person2 = new Person("John");
```

Just like in Ruby, a constructor acts as a template for all new People in the future. However, it's a little bit more than just a template because of how Prototypical inheritance works, as instances of an Object have links to the object that created them.

#### .constructor

Let's say we wanted to figure out where a "class" came from: we can use use the property [`.constructor`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/constructor) to take a look at the function that instantiated a new object:

```javascript
Person.constructor
// Object()
```

A new function is always an example of Object() in Javascript.

Now, if we instantiate the Person class -  with the declarative syntax - we see that the constructor (alex) is now a reference to the custom constructor function (`Person(name)`).

```javascript
function Person(name){
  this.name = name;
}

var alex = new Person("alex");
alex.constructor
// Person(name)
```

We can also use [`Object.getPrototypeOf`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getPrototypeOf) to do the same:

```javascript
Object.getPrototypeOf(alex)
// Person {}
```

## Adding Properties and Methods to Objects - Codealong (15 mins)

Let's revisit the constructor function from earlier, and use it to create two people from the Person class:

```javascript
function Person(name){
  if (!(this instanceof Person)) {  
    return new Person(name);
  }
  this.name = name;
}

var mum = Person("mum");
var dad = Person("dad");
```

Of course, we'll want to add information to our existing objects.  Super easy with dot notation:

```javascript
mum.nationality = "British";
// "British"
```

And dad will be unaffected:

```javascript
dad.nationality
// undefined
```

How about adding a method? Also easy:

```javascript
mum.speak = function() { alert("hello"); }
mum.speak()
```

Again, `dad` will not have this function, only `mum` will have it.


#### What if we wanted to change all instances of the Object?

If we wanted to add a new property to both `mum` and `dad` after they've been instantiated, we can define a property on the shared prototype; and since the `mum` and `dad` objects have the same prototype, they will both inherit that property.

```javascript
Person.prototype.species = "Human";
// "Human"

mum.species
// Human

dad.species
// Human
```

Amazing!

<br>

#### Use the Prototype

Using Prototype will enable us to easily define methods to all instances of the instances while saving memory. What's great is that the method will only be applied to the prototype of the object, so it is only stored in the memory once, because objects coming from the same constructor point to one common prototype object.

In addition to that, all instances of Person will have access to that method.

```javascript
function Person(name){
  if (!(this instanceof Person)) {  
    return new Person(name);
  }
  this.name = name;
}

Person.prototype.speak = function(){
  alert("My name is, " + name);
}

var mum = Person("mum");
var dad = Person("dad");

mum.speak == dad.speak;
// true
```

So if you have methods that are going to be shared by all instances of an Object, they can all have access to them.

## Create your own - Independent Practice (15 mins)

You are going to take over the Javascript world with a new army of Soldier objects.

- Create a new soldier constructor function that allows you to create soldiers
- A soldier should be able to have a `name` and `number`
- The default type of a solder should be `footsoldier`
- The soldier's `number` should sequentially increase
- Each soldier in the army should have the same battleCry, an alert of "FREEDOM!"
- Your army should have a general who's type is `general`
- Your general's number should be incremented inline with your footsolders

## Closure - (5 mins)

Thinking of real world problems in this object context is a new challenge. Identify another problem domain and white board the JavaScript representation in an object.

For Example: A bank ATM could use what kind of objects? With what attributes? With what abilities? account user withdraw ...etc.

- Explain how classes differ in Ruby versus JavaScript.
- Describe the purpose of a constructor function.