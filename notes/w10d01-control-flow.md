![ga_cog_large_red_rgb](https://cloud.githubusercontent.com/assets/40461/8183776/469f976e-1432-11e5-8199-6ac91363302b.png)

WDI
======
## Control Flow

### Core Competencies:

- Core Competency #1
- Core Competency #2

<br>
---

### Learning Objectives:

- Explain conditional execution
- Explain while, until and for loops
- Explain boolean logical operators

<br>
---

### Timings:
| **Section**      | **Timing** | **Summary** |
|------------------|------------|-------------|
| Opening          | 5 mins | Introduction to the topic
| **We Do**: Boolean (logical) operators | 10 mins | Going over boolean logic in irb
| **We Do**: Conditional execution| 10 mins | `If`, `else`, `elsif` and `unless`    
| **We Do**: Case Statements | 10 mins | A look at case statements
| **We Do**: Looping | 15 mins | Explanation of Ruby's while, until, foor and loop
| **We Do**: Controlling the loop | 10 mins | Looking at `next`, `break`, `redo` and `retry`
| **Lab**: Make a maths game | 15 mins | Make a quick maths game using a loop
| **Deliverable** | 10 mins | Show a solutions.
| **Closure** | 5 mins | Explain that we use the Enumerable module   
| **Questions** | 10 mins |  Any questions?

<br>
---

### Connection to a long term learning goal 

- Students must be able to understand conditional execution and control flow
- Students must be able to think efficiently using conditional logic
- Students must be able to use boolean logic

<br>
---

### Before Class (Student Pre-work)

- Students must have completed the prework 
- Students must have created a ruby file and run it with ruby

<br>
---

### Related Homework	

TBC.

<br>
---

# Control Flow

## Opening

Programs don't always run in a staight line (top to bottom or left to right). Execution order is determined by a variety of rules and programming constructs.

We collectively referred to these as to as control-flow techniques.

We will be looking at:

#### Conditional execution & boolean logic

- Execution depends on the truth of an expression 

#### Looping

- Where a single segment of code is executed repeatedly

#### Iteration

- Where a call to a method is supplemented with a block that can be used repeatedly

<br>

## We Do: Boolean (logical) operators

In Ruby, we can use boolean logic to check for 'truthyness' or 'falseyness'. This is different to checking whether something equals true (an instance of the TrueClass) or false (an instance of the FalseClass).

Remember, only true and false are Booleans.

Open irb:

```	
$ irb
```

#### or	
	
```
true || false
=> true
	
false || true
=> true
```

The right side is not evaluated if the left side is true. This is called short-circuit evaluation.

#### and 

(Think of as both are true!)

```
false && true
=> false
  	
true && true
=> true
  	
false && false
=> false
```
  	
If the left hand side is false, the right side won't be evaluated. This is another example of short-circuit evaluation.

The one confusing and is:

```
nil && true
=> nil
```

In Ruby only nil and false are falsey, everything else is truthey including 0!

#### not
  	
A bit like  "the opposite of"

```
!true
=> false
  	
!false
=> true
  	
x = "hello"
=> "hello"
!x  	
=> false
# as "hello" is truthy
  	
x = nil
=> nil
!x
=> true
# as nil is falsey
```
  	
<br>

## We Do: Conditional execution

Ruby gives you a number of ways to control program flow on a condition basis.

- ```if``` and related keywords
- ```case``` statements

#### Create a file

```
$ touch control_flow.rb
```

#### if

You can run some code conditionally ```if``` something is true:

```
# in control_flow.rb

puts "hello" if true
```

This is called a 'conditional modifier' and sometimes referred to as a 'guard'.
Test with:

```
$ ruby control_flow.rb 
```

#### else

Let's create a multi-line ```if``` statement:

```
# in control_flow.rb

if true 
  puts "hello" 
else
  puts "bye" 
end	
```
    
Then run using:

```
$ ruby control_flow.rb
```
    
You can also do this on one line using the ```then``` keyword:

```
if true then puts "hello" else puts "bye" end
```

You can also do this using semi-colons to mimic the line-breaks:

```
if true; puts "hello"; else; puts "bye"; end
```

I think you'll agree, the mutli-line is the easiest to read.

#### elsif

There is also an ```elsif``` keyword (with no e):

```
# in control_flow.rb

print "Enter an integer: "
n = gets.to_i
if n > 0
  puts "Your number is positive."
elsif n < 0
  puts "Your number is negative."
else
  puts "Your number is zero."
end
```

Notice that you can have a final ```else``` after multiple ```elsif```'s.

#### unless

Similar to ```if``` is the ```unless``` keyword:

```
# in control_flow.rb

print "Enter an integer: "
n = gets.to_i
unless n > 10
  puts "too small..."
else
  puts "LARGE number!"
end
```

Sometimes ```unless``` is confusing. However, it does make sense when using guards:

```
user_registered = false
puts "Please signup!" unless user_registered
```

<br>

## We Do: Case Statements

A ```case``` statement starts with an expression - usually a single object or variable, but any expression can be used.

```
# in control_flow.rb

puts "Exit the program? (yes or no): "
answer = gets.chomp

case answer
when "yes"
  puts "Good-bye!"
  exit 
when "no"
  puts "OK, we'll continue"
else 
  puts "That's an unknown answer -- assuming you meant 'no'"
end
puts "Continuing with the program..."
```
	
```when``` actually uses the three-equal-operator ```===``` behind the scenes.

<br>

## We Do: Looping

Conditional looping in Ruby can be achieved using the keywords ```while``` and ```until```. 

#### while

```
# in control_flow.rb

n = 1
while n < 11
  puts n
  n = n + 1
end
puts "Done!"
```

As long as the condition ```n < 11``` is true the loop with execute. With each loop n is incremented by 1 until the condition is false.

#### until

The ```until``` loop is the the same as the ```while``` loop but with reverse logic.

```
# in control_flow.rb

n = 1
until n > 10
  puts n
  n = n + 1
end
```
    
[i]: Optional, if time.

#### for

```for``` is a special Ruby keyword that indicates the beginning of the loop:

```
# in control_flow.rb
	
for i in 1..10
  puts i
end    
```
  
```1..10``` is a Range, It consists of a low and a high number separated by two dots. Basically, it is the set of integers from a to b, sequentially.

You can read this entire line as: for every number in 1 to 10, run the following code block.

```for``` is not very "Ruby".

##### do

In the code block above, the ```do``` is optional in the code block

```
for i in 1..10 do
  puts "The number is #{i}"
end  
```

You CAN'T write as:

```
for i in 1..10 { puts "The number is #{i}" }
```

<br>

[i]: End optional

## We Do: Controlling the loop

Sometimes, you want to exit out of a loop. There are a few keywords that you can use:

#### break

You might want to use ```break``` to stop the loop 

```
for i in 0..5
  break if i > 2
  puts "The number is #{i}"
end
```

#### next

```next``` skips to the next iteration of the loop without finishing the current loop

```
n = 1
while n < 1000
  n = n + 1
  puts n
  next unless n == 10
  break
end
```

#### redo, retry

There is also ```redo``` and ```retry``` but they aren't used much.

<br>

## I Do: Infinite loops

The problem with loops is that if you don't get the logic right, they can be infinite.

```loop``` is another method in Ruby that accepts a block like ```for```. We will go into blocks in more detail in another lesson:

```
$ irb

loop { puts "looping forever" }
	
# ctrl+c to exit
```
	
Just be careful!

<br>

## Lab: Make a maths game

Let's write a program that asks a user to guess the answer to a maths question, and loops until they get it right.

Use ```puts```, ```gets```. It can be any maths problem. 

<br>

## Deliverable

Run the file: 

```
$ ruby control_flow_lab.rb
```

<br>

## Closure

Loops are really useful to do lots of calculations really quicky. Some of these methods of looping are not very "Rubyish".

We often use Enumerable methods to achieve looping. We will look at this in more detail in a future lesson.

<br>

## Questions

Any questions?

<br>