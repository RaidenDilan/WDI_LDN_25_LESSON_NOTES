[User, Event, Comment].each do |model|
  ActiveRecord::Base.connection.execute("TRUNCATE #{model.table_name} RESTART IDENTITY CASCADE")
end

raiden = User.create!(username: "raidend", email: "raiden.dilan@ga.co", password: "password", password_confirmation: "password")
emily = User.create!(username: "emilyi", email: "emily.isacke@ga.co", password: "password", password_confirmation: "password")
ajay = User.create!(username: "ajaylard", email: "ajay.lard@ga.co", password: "password", password_confirmation: "password")
mike = User.create!(username: "mickyginger", email: "mike.hayden@ga.co", password: "password", password_confirmation: "password")
will = User.create!(username: "ruthlessamo", email: "will.hilton@ga.co", password: "password", password_confirmation: "password")

ball = Event.create!(name: "WDI25 Grad Ball", date: Date.new(2017, 4, 28), location: "Black Horse, Leman Street, London", user: raiden, attendees: [emily, ajay, mike, will])
