# SDS-Backend
## Project Goals:
### Customer side portal:
A menu where all the items offered by a restaurant are available and are categorised section wise as organised by the admin.
Customers can select the quantity of any item and also provide any specific instructions for the chef.
An order page that takes a table number and shows the items and quantity of each item selected with their prices and any specific instructions. 
### Chef/Kitchen side portal:
A chefs side which can see all orders and any instructions provided and table. Chefs can mark any particular order/(item in order) completed.
### Admin portal
An admin side from where admin can see any particular order going on and can modify their state and generate a bill for an order which is available on the customers side.
A page on the admin side to see all orders catered to date.
### Things to Note:
- Implement a search with filters and pagination wherever possible on all three portals.
- Use JWT authentication and store hashed passwords using bcrypt.
- Try to do Self salting (and hash with bcrypt using the salt) as a brownie.
- A decent frontend with EJS and any CSS based frameworks is expected and for the database use MySQL.
## Database Schema
- Menu Table: Links food to menu-id
  - `menu_id`
  - `item_name`
  - `price`
  - `image_url`
  - `category`
- Order Table: Links costumer to their order and table
  - `order_id`
  - `customer_id`
  - `table`
- Order Details: Links an order id to the menu items in the order
  - `order_id`
  - `menu_id`
  - `quantity`
- Users Table: Stores passwords and roles
  - `user_id`
  - `user_name`
  - `password`
  - `user_role` (chef, admin, customer)
  
## Functionality to add
- Admin section 
  - can view all orders and order details
  - allow admin to modify all tables
  - generate bills and add it to customer side 
  - (does so by changing status of order_id to payment pending)
  - once client does payment, order is changed to payment done
- Menu section 
  - display menu 
  - show items with picture and price 
- Customer section 
  - Show customer orders
  - Allow placement of new orders
  - Show order Status
  - Proceed to payment
- Order section 
  - Display Menu 
  - show items with picture and price
  - add button to add to order, also add a counter for quantity
  - place order button
- Login section 
  - provide choice, chef or customer
  - add admin login(admin can login either from chef or customer)
- Chef section 
  - can view all orders 
  - can mark order as completed
## TODO-list
- create admin side
- 