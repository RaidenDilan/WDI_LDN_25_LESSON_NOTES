---
title: Making a Test Framework Lesson
type: lesson
duration: "0:45"
creator:
    name: Alex Chin & Mike Hayden
    city: London
competencies: Testing
---

# Intro to Testing

### Objectives
*After this lesson, students will be able to:*

- Understand the concept of a creating tests
- Be familiar with the concept of TDD
- Recognise common testing syntax & patterns

### Preparation
*Before this lesson, students should already be able to:*

- Write and call functions in JavaScript
- Can create an object in JavaScript

## What is testing - Intro (15 mins)

Testing is the process of making sure your code does what it's supposed to.

### Manual testing

Manual testing, or error-driven development, is just what it sounds like: checking all the code works as expected after you change any source code, including testing your application from your web interface. This is limited by the time you need to test *everything* whenever you change *anything*. The larger the code base gets, the harder it is to check every line and every page every time a change is made.

### Automated testing

Automated testing is achieved by writing code that checks your code. This may involve writing some code that plays through scenarios that address various possible input values and the expected outcomes.

When you write very small tests that check very small sections of classes or models, we call that "unit" testing.

As your code base grows, so does you test coverage. You should get to a situation where you can run your test code at any time, and every single line of your code gets passed through to ensure it's still returning what you expected it to when it was first written.

#### What is TDD?

TDD stands for test-driven development. Also called red/green development, in TDD, you write the tests first, before writing any code and then write code that makes the test pass.

The test will initially fail - that's the point of the 'red' - and the expectations of the test will drive how you will write your actual code - this is referred to as your implementation - until the test passes, or goes 'green'.

Frequently, TDD is approached with pair programming - two developers working together at one machine. Often, one person writes a test; then, the other writes the implementation, and they alternate throughout the day. In an interview, you might be given some test code and be asked to write the implementation code; or you might be asked to write the tests for some outline functionality to demonstrate your familiarity with this process.

The process is also referred to as red/green/refactor because once the test passes (and it's "green"), you can review the code you've written and any other parts of the code that's affected to see if it can be cleaned up at all. No new functionality is added at this stage - the desired outcome is still for the tests to pass, just as they had before, but with more efficient code.

<p align="center">
<img src="http://www.pathfindersolns.com/wp-content/uploads/2012/05/red-green-refactorFINAL2.png">
</p>

### Testing at the end?

Often developers do not write their code TDD, this might be because there isn't time or there isn't enough budget. Developers often "intend" to write tests but they don't don't get around to it. 

It is a great habit to get into!

## Closure

We will be looking into testing more throughout the course. Having some experience with testing is great when applying for junior developer roles, as a lot of technical interviews involve testing or TDD.

TDD is also a great way breaking down problems. Just by thinking about the kind of tests you need to write, and writing them helps to understand the problem you are trying to solve.