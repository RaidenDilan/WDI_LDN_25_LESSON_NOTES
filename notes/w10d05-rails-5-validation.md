# Validations

So far, we've not been checking for whether or not the values that users have been entering in forms have been valid for our needs.

Checking that model attributes are within the bounds we want for saving in the database is called "validation".

#### Setup app

```bash
rails new validations_app -d postgresql
cd validations_app
rails g model Customer name:string email:string password:string age:integer active:boolean
rails g model Order customer:references value:decimal payment_type:string card_number:string
rails g model Invoice paid:boolean
rake db:migrate
```

ActiveRecord objects either correspond to a DB row, or they've not been saved yet.

```ruby
cust = Customer.new(name: "John Doe")
cust.new_record?
cust.save
cust.new_record?
```

Validations are run before a record is saved. If any validations fail, the object does not get saved to the database.


##  Some validations

### presence

```ruby
# customer.rb
validates :name, presence: true
```

### length

```ruby
# customer.rb
validates :name, length: { minimum: 2 } 
validates :name, length: { maximum: 500 }
validates :name, length: { in: 8..255 }
```

### numericality

```ruby
# order.rb

#integer and float
validates :value, numericality: true 

#only integer
validates :value, numericality: { only_integer: true }
```

Also allows for `:greater_than`, `:less_than`, `:odd`, `:even`, `:equal`, et al.


### uniqeness

```ruby
# customer.rb

validates :name, uniqueness: true
```

### lots more besides

We're not going into them, they're in the api

Some AR methods do skip validations, but `create`, `save`, and `update_attributes` (and their bang alternatives) require validations to pass.

To skip manually you can pass the `validate: false` option:

```
c.save(validate: false)
```

To check manually without saving you can ask if an object is valid or invalid:

```
cust.valid?
cust.invalid?
```

## Errors

Any errors from validations which fail are placed into the `errors` collection of each AR object.

```ruby
# customer.rb
validates :name, presence: true

c = Customer.new
c.errors # also call `.class` and `.to_a`
c.valid?
c.errors # .to_a
c.errors.full_messages

c.save
c.save!
c.name = "gimme a name"

c.save
```

## Conditionally validating

Sometimes we only want to validate if certain conditions are met, and the validations can take options for `:if` and `:unless`:

```ruby
# with symbol for method
class Order < ActiveRecord::Base
  .
  .
  .
  validates :card_number, presence: true, if: :paid_with_card?
   
  def paid_with_card?
    payment_type == "card"
  end
end
```

Let's test with:

```ruby
o = Order.new(payment_type: "card")
o.save
o.errors

#<ActiveModel::Errors:0x007f871e7de6f8 @base=#<Order id: nil, customer_id: nil, value: nil, payment_type: "card", card_number: nil, created_at: nil, updated_at: nil>, @messages={:value=>["is not a number", "is not a number"], :card_number=>["can't be blank"]}>
```

Alternatively, you can use a Proc instead of a method:
 
```
# with Proc
class Customer < ActiveRecord::Base
  .
  . 
  .
  validates :password, length: { minimum: 2 }, if: Proc.new { |u| u.password.present? }

  ## this is and alternate proc syntax
  # validates :password, length: { minimum: 2 }, if: -> (u) { u.password.present? }
end
```

Let's test with:

```ruby
c1 = Customer.new(password: "a")
c1.save
c1.errors
```

We can also specify when the validation should take place - whether the record needs create/update/save (defaults to 'save')

```ruby
class Customer < ActiveRecord::Base
  .
  .
  .
  # it will be possible to update email with a duplicated value
  validates :email, uniqueness: true, on: :create
   
  # it will be possible to create the record with a non-numerical age
  validates :age, numericality: true, on: :update
   
  # the default (validates on both create and update)
  validates :name, presence: true, on: :save
end
```

## Custom Validation 

Write your own methods to verify the state of your objects.

```ruby
class Order < ActiveRecord::Base
  .
  .
  .
  validate :active_customer, on: :create
   
  def active_customer
    errors.add(:customer_id, "is not active") unless self.active?
  end
end
```

Add errors to attributes of the model or to the 'base' to cause the validations to fail, and to interrupt the save/create/update.

To test we can do:

```ruby 
c1 = Customer.new(name: "Alex", password: "password", age: 27)
c1.save
c1.errors
=> #<ActiveModel::Errors:0x007f871e55d000 @base=#<Customer id: nil, name: "Alex", email: nil, password: "password", age: 27, active: nil, created_at: nil, updated_at: nil>, @messages={:name=>["is too short (minimum is 8 characters)"], :customer_id=>["is not active"]}>
```

## Exercise

Let's create a blog site which has Articles that can be commented on.

```bash
rails new validations_exercise
cd validations_exercise
rails g model Article author_name:string title:string body:text
rails g model Comment author_name:string article:references body:text
rake db:migrate
rails c
```

1. Write validations to check that an Article object must have both a title and a body.
2. Validate that a Comment has a body of less than 250 characters.
3. Validate that neither articles nor comments have the word "drupal" in their body.
4. Validate that a comment must have an associated article. 
5. Validate that no author comments on their own article.

[http://guides.rubyonrails.org/v4.1.8/active_record_validations.html]()


[i]: Exercise answers:

```ruby
class Article < ActiveRecord::Base
  validates :title, presence: true
  validates :body, presence: true
  validate :doesnt_mention_drupal
  
  private
  
  def doesnt_mention_drupal
    errors.add(:body, "must not mention drupal") if body.to_s.match('drupal')
  end
end

class Comment < ActiveRecord::Base
  belongs_to :article
  validates :body, length: { maximum: 250 }
  validates :article, presence: true
  validate :not_author_of_article
  validate :doesnt_mention_drupal
  
  private
  def not_author_of_article
    errors.add(:base, "mustn't comment on own article") if author_name && article.try(:author_name)==author_name
  end
  
  private
  def doesnt_mention_drupal
    errors.add(:body, "must not mention drupal") if body.to_s.match('drupal')
  end
end
```