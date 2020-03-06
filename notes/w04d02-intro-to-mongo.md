---
title: Intro to NoSQL with Mongo
type: Lesson
duration: '"1:25"'
creator:
    name: Jim Clark / Micah Rich
    city: LA
competencies: Databases
---

# Intro to NoSQL with Mongo

### Objectives
- Describe how Mongo databases came about & why they're useful
- Define what a document is in the context of MongoDB
- Explain the difference between embedded and referenced documents, and how we use each to model relationships in MongoDB
- Issue basic CRUD commands to a database from the Mongo Shell

### Preparation
- Create an Express app from scratch
- Use and configure middleware like body-parser to handle form submissions

## What is MongoDB - Intro (15 mins)

#### What Mongo isn't: SQL

SQL stands for **Structured Query Language** and is used to interact with **Relational Databases** such as PostgreSQL, MySQL and Oracle.

We will be usig PostgreSQL later in the course. For now, all you really need to know is that these more traditional databases store data in tables, similar to an excel spreadsheet.

SQL databases are mature and robust, but do have some flaws. As the name implies they have to be very structured, and as a result are not suitable for all types of data, and they can require quite a lot of hardware resources to run. 

#### Mongo & NoSQL Databases

MongoDB is one of the new breeds of databases known as NoSQL databases. NoSQL databases are heavily used in realtime, big data and social media applications and generally called NoSQL because they do things a little differently than traditional SQL databases.

So you know – there are software "drivers" that allow MongoDB to be used with a multitude of programming languages and frameworks, including both Node and Ruby on Rails.

For this session, we'll be connecting directly to a mongo database from the terminal. So what's a Mongo database look like?

#### Data Format

- A MongoDB database consists of a set of _collections_.
- Each _collection_ contains a set of _documents_.
- A _document_ in MongoDB is composed of _field_ and _value_ pairs.
- You can think of it as an array of objects. The array is the _collection_, and the objects inside are the _documents_. 
Lets take a look of what a MongoDB _document_ may look like:

```js
{
    _id: ObjectId("5099803df3f4948bd2f98391"),
    name: { first: "Alan", last: "Turing" },
    birth: new Date('Jun 23, 1912'),
    death: new Date('Jun 07, 1954'),
    contribs: [ "Turing machine", "Turing test", "Turingery" ],
    views: 1250000
}
```

As you can see, it's just a **javascript object**, with **keys** and **values**. 

#### The Document *_id*

The *_id* is a special field represents the document's _primary key_ and will always be listed as the first field. It must be unique.

We can explicitly set the *_id* like this:

```js
{
  _id: 2,
  name: "Suzy"
}
```
or this...

```js
{
  _id: "ABC",
  name: "Suzy"
}
```
However, it's more common to allow MongoDB to create it implicitly for us using its _ObjectID_ data type. Each document **must** have a _unique_ id. Rather than writing some code to always create a unique id for each document, we should let Mongo do it for us.

## Installing, Creating a DB, and Inserting Documents - Codealong (15 mins)

#### Installation

You may already have MongoDB installed on your system, lets check in terminal `which mongod` (note the lack of a "b" at the end").

If you get `/usr/local/bin/mongod`, you're golden!

If you get a null response, lets use _Homebrew_ to install MongoDB:

1. Update Homebrew's database (this might take a bit of time)<br>`brew update`
2. Then install MongoDB

 `brew install mongodb`

1. MongoDB by default will look for data in a folder named `/data/db`. We would have had to create this folder, but Homebrew did it for us (hopefully).
   1. run this command in your terminal:
```shell
[ ! -d /data/db ] && sudo mkdir -p /data/db && sudo chown -R $(whoami) /data/db || ls -la /data
```
   2. You should get something like this:
```shell
total 0
drwxr-xr-x   3 root       wheel   102 Nov 11 13:06 .
drwxr-xr-x  38 root       wheel  1360 Nov 11 13:06 ..
drwxr-xr-x   8 jseminara  wheel   272 Nov 11 13:10 db
```

#### Start Your Engine

`mongod` is the name of the actual database engine process. The installation of MongoDB does not set mongoDB to start automatically. A common source of errors when starting to work with MongoDB is forgetting to start the database engine.

To start the database engine, type `mongod` in terminal.

Press `control-c` to stop the engine.

#### Creating a Database and Inserting Documents

MongoDB installs with a client app, a JavaScript-based shell, that allows us to interact with MongoDB directly.

Start the app in terminal by typing `mongo`.

The app will load and change the prompt will change to `>`.

List the shell's commands available: `> help`.

Show the list of databases: `> show dbs`.

Show the name of the currently active database: `> db`.

Switch to a different database: `> use [name of database to switch to]`.

Lets switch to the `local` database: `> use local`.

Show the collections of the current database `> show collections`.

#### Creating a new Database

To create a new database in the Mongo Shell, we simply have to _use_ the database.  Lets create a database named _myDB_:

```
> use myDB
```

#### Inserting Data into a Collection

This how we can create and insert a document into a collection named _people_:

```
> db.people.insert({
... name: "Fred", // Don't type the dots, they are from the
... age: 21     // shell, indicating multi-line mode
})
```

Using a collection for the first time creates it!

#### Adding Lots of New Documents

In a moment we'll practice querying our database, but let's get more data in there. Here are few more documents to put in your _people_ collection. We can simply provide this __array__ to the _insert_ method and it will create a document for each object in the array.

```js
db.people.insert([
  {
    "name": "Emma",
    "age": 20
  },
  {
    "name": "Ray",
    "age": 45
  },
  {
    "name": "Celeste",
    "age": 33
  },
  {
    "name": "Stacy",
    "age": 53
  },
  {
    "name": "Katie",
    "age": 12
  },
  {
    "name": "Adrian",
    "age": 47
  }
]);
```

> Note: Be sure to type the closing parent of the _insert_ method!


## Querying Documents - Codealong (10 mins)

To list all documents in a collection, we use the _find_ method on the collection without any arguments:

```
> db.people.find()
```

Again, unlike the rows in a relational database, our documents don't have to have the same fields!

### More Specific Queries

We can also use the `find()` method to query the collection by passing in an argument – a JS object containing criteria to query with.

```
> db.people.find({ name: "Emma" })

```

There are a handful of special criteria variables we can use, too. Here's how we can use MongoDB's `$gt` query operator to return all _people_ documents with an age greater than 20:

```
> db.people.find({ age: { $gt: 20 } })
```

MongoDB comes with a slew of built-in [query operators](http://docs.mongodb.org/manual/reference/operator/query/#query-selectors) we can use to write complex queries.

__How would we write a query to retrieve people that are less than or equal to age 20?__

In addition to selecting which data is returned, we can modify how that data is returned by limiting the number of documents returned, sorting the documents, and by projecting which fields are returned.

This sorts our age query and sorts by _name_:

```
> db.people.find({ age: { $gt: 20 } }).sort({ name: 1 })
```
The `1` indicates ascending order.

[This documentation](http://docs.mongodb.org/manual/core/read-operations-introduction/) provides more detail about reading data.

## Updating Data - Codealong (5 mins)

In MongoDB, we use the `update()` method of collections by specifying the _update criteria_ (like we did with `find()`), and use the `$set` action to set the new value.

```
> db.people.update({ name: "Emma" }, { $set: { age: 99 } })
```

By default `update()` will only modify a single document. However, with the `multi` option, we can update all of the documents that match the query.

```
> db.people.update({ name: { $lt: "M" } }, { $inc: { age: 10 } }, { multi: true })
```
We used the `$inc` update operator to increase the existing value.

Here is the [list of Update Operators](http://docs.mongodb.org/manual/reference/operator/update/) available.

## Removing Data - Codealong (5 mins)

We use the `remove()` method to data from collections.

If you want to completely remove a collection, including all of its indexes, use `[name of the collection].drop()`.

Call `remove({})` on the collection to remove all docs from a collection. Note: all documents will match the "empty" criteria.

Otherwise, specify a criteria to remove all documents that match it:

```
> db.people.remove({ age: { $lt: 50 } })
```

## Data Modeling in MongoDB - Intro (10 mins)

There are two ways to modeling related data in MongoDB:

- via __embedding__
- via __referencing__ (linking)

Both approaches can be used simultaneously in the same document.

### Embedded Documents

In MongoDB, by design, it is common to __embed__ data in a parent document.

To demonstrate __embedding__, we will add another person to our _people_ collection, but this time we want to include contact info. A person may have several ways to contact them, so we will be modeling a typical one-to-many relationship.

## Modeling Data - Codealong (15 mins)

Let's walk through this command by entering it together:

```js
> db.people.insert({
    name: "Manny",
    age: 33,
    contacts: [
      {
        type: "email",
        contact: "manny@domain.com"
      },
      {
        type: "mobile",
        contact: "(555) 555-5555"
      }
    ]})
```

__What do you imagine could be a downside of embedding data?__

If the embedded data's growth is unbound, MongoDB's maximum document size of **16 megabytes** could be exceeded.

The above approach of embedding _contact_ documents provides a great deal of flexibility in what types and how many contacts a person may have.  However, this flexibility slightly complicates querying.

However, what if our app only wanted to work with a person's multiple _emails_ and _phoneNumbers_?

__Knowing this, pair up and discuss how you might alter the above structure.__

#### Referencing Documents

We can model data relationships using a __references__ approach where data is stored in separate documents. These documents, due to the fact that they hold different types of data, are likely be stored in separate collections.

It may help to think of this approach as _linking_ documents together by including a reference to the related document's *_id* field.

Let's create a new `bankAccounts` collection:

```js
> use bankAccounts
```

> **Note:** Use the idea that the person might have a _joint account_, which is owned by more than one person.

If two people were to share the same bank account, I would not make any sense to _embed_ the account data in the user documents, because every time a user made a withdrawal, the account balance would have to be updated in **both** documents. This is a bad design pattern, and would require a lot of work to ensure the account data was always accurate.

What would be better, is if we were to store the bank account data in a seperate _collection_ and then **reference** it in the user documents.

Let's first create a bank account:

```
> db.bankAccounts.insert({
	balance: 2000,
})
```

Now let's get that account's _id_:

```
> db.bankAccounts.findOne({})
{ "_id" : ObjectId("56426f481779b50ee5267752"), "balance" : 2000 }
```

Now let's create two people, and **reference** the bank account in both documents:

```
> db.people.insert([{
  name: "Miguel",
  age: 46,
  bankAccount: ObjectId("56426f481779b50ee5267752")
},{
  name: "Naveen",
  age: 32,
  bankAccount: ObjectId("56426f481779b50ee5267752")
}])
```

In order to find Miguel's bank information, first we need to retrieve his user document from the database:

```
> db.people.findOne({ name: "Miguel" });
{ "_id" : ObjectId("56426f481779b50ee5267431"), "name" : "Miguel", "age" : 46, "bankAccount" : ObjectId("56426f481779b50ee5267752") }
```

Now we can use the bankAccount id, to find the bank account document:

```
> db.bankAccounts.find({ "_id": ObjectId("56426f481779b50ee5267752") })
{ "_id" : ObjectId("56426f481779b50ee5267752"), "balance" : 2000 }
```

We can also do it in one command, _but mongo still has to make two queries regardless_:

```
> db.bankAccounts.find({ "_id": db.people.findOne({ name: "Miguel" }).bankAccount })
{ "_id" : ObjectId("56426f481779b50ee5267752"), "balance" : 2000 }
```

## Data Modeling Best Practices - Discussion (10 mins)

MongoDB was designed from the ground up with application development in mind. More specifically, what can and can't be done in regards to data is enforced in your application, not the database itself.

Here are a few things to keep in mind:

- For performance and simplicity reasons, lean toward _embedding_ over _referencing_.
- Prefer the _reference_ approach when the amount of child data is unbound.
- Prefer the _reference_ approach when multiple parent documents access the same child document and that child's document changes frequently.
- Obtaining _referenced_ documents requires multiple queries by your application.
- In the _references_ approach, depending upon your application's needs, you may choose to maintain links to the related document's *_id* in either document, or both.

For more details regarding data modeling in MongoDB, start with [this section of mongoDB's documentation ](http://docs.mongodb.org/manual/core/data-modeling-introduction/) or this [hour long YouTube video](https://www.youtube.com/watch?v=PIWVFUtBV1Q)


## Conclusion (5 mins)
- What are some of the differences between Mongo & Postgres databases?
- How do you add a document to a collection in the Mongo shell?
- Describe the difference between embedding & referencing documents. Give an example of when you might use each.