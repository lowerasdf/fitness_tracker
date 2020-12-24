# Fitness Tracker Application in React Native (iOS only)
A frontend application in React Native that can track your fitness exercises and calories based on meals. The backend endpoints are available [here](#be), or can be seen in the [collection (v2.1) of the Postman requests](/ReactNative.postman_collection.json).

### Features
- Sign-up & Log-in
- Today's Goals & Reminders
- Exercises & Meals Tracker
- Profile View
- Accessibility Features (VoiceOver)

### Screenshots
<img src="screenshots/login.PNG" width="300"> | <img src="screenshots/add_exercise.PNG" width="300"> | <img src="screenshots/exercises.PNG" width="300"> | <img src="screenshots/today.PNG" width="300"> | <img src="screenshots/meals.PNG" width="300"> | <img src="screenshots/profile.PNG" width="300">

### Installation
Make sure you have [npm](https://docs.npmjs.com/) and [expo CLI](https://docs.expo.io/workflow/expo-cli/) installed. To install all the dependencies for the first time, run <pre><code>expo install</code></pre>
Once installed, simply run <pre><code>expo start</code></pre> to start the project. You can download [Expo Development Client](https://expo.io/tools) on your mobile device to test it out.

<a name="be"></a>
### Backend Endpoints
The following API can be accessed at `https://mysqlcs639.cs.wisc.edu`
| Endpoint                                       | Auth Required | Token Required | Get | Post | Put | Delete |
|------------------------------------------------|---------------|----------------|-----|------|-----|--------|
| /login                                         | ✔︎             |                | ✔︎   |      |     |        |
| /users                                         |               |                |     | ✔︎    |     |        |
| /users/`<username>`                            |               | ✔︎              | ✔︎   | ✔︎    | ✔︎   | ✔︎      |
| /tags                                          |               |                | ✔︎   |      |     |        |
| /categories                                    |               |                | ✔︎   |      |     |        |
| /categories/<category_title>/tags              |               |                | ✔︎   |      |     |        |
| /products                                      |               |                | ✔︎   |      |     |        |
| /products/`<product_id>`                       |               |                | ✔︎   |      |     |        |
| /products/`<product_id>`/tags                  |               |                | ✔︎   |      |     |        |
| /products/`<product_id>`/reviews               |               |                | ✔︎   |      |     |        |
| /products/`<product_id>`/reviews/`<review_id>` |               |                | ✔︎   |      |     |        |
| /application                                   |               | ✔︎              | ✔︎   |      | ✔︎   |        |
| /application/tags                              |               | ✔︎              | ✔︎   |      |     | ✔︎      |
| /application/tags/`<tag_value>`                |               | ✔︎              |     | ✔︎    |     | ✔︎      |
| /application/messages                          |               | ✔︎              | ✔︎   | ✔︎    |     | ✔︎      |
| /application/messages/`<message_id>`           |               | ✔︎              | ✔︎   |      | ✔︎   | ✔︎      |
| /application/products                          |               | ✔︎              | ✔︎   |      |     | ✔︎      |
| /application/products/`<product_id>`           |               | ✔︎              |     | ✔︎    |     | ✔︎      |
