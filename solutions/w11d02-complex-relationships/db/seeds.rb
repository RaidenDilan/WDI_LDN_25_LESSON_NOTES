user = User.create!(username: "mickyginger", email: "mike.hayden@ga.co")

Event.create!(
  name: "WDI25 Grad Ball",
  date: Date.new(2017, 4, 28),
  location: "Black Horse, Leman Street, London",
  user: user
)
