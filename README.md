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
Make sure you have [npm](https://docs.npmjs.com/) and [expo CLI](https://docs.expo.io/workflow/expo-cli/) installed. To install all the dependencies for the first time, run `expo install`. Once installed, simply run `expo start` to start the project. You can download [Expo Development Client](https://expo.io/tools) on your mobile device to test it out.

<a name="be"></a>
### Backend Endpoints
<figure class="md-table-fig">
<table class="md-table" style="border-style: solid; height: 478px; width: 619px;" border="1">
<thead>
<tr class="md-end-block" style="height: 28px;">
<th style="height: 28px; width: 243px;"><span class="td-span"><span class="md-plain">Route</span></span></th>
<th style="height: 28px; width: 100px;"><span class="td-span"><span class="md-plain">Auth Required</span></span></th>
<th style="height: 28px; width: 107px;"><span class="td-span"><span class="md-plain">Token Required</span></span></th>
<th style="height: 28px; width: 31px;"><span class="td-span"><span class="md-plain">Get</span></span></th>
<th style="height: 28px; width: 37px;"><span class="td-span"><span class="md-plain">Post</span></span></th>
<th style="height: 28px; width: 30px;"><span class="td-span"><span class="md-plain">Put</span></span></th>
<th style="height: 28px; width: 53px;"><span class="td-span"><span class="md-plain">Delete</span></span></th>
</tr>
</thead>
<tbody>
<tr class="md-end-block" style="height: 30px;">
<td style="height: 30px; width: 243px;"><span class="td-span"><span class="md-plain">/login/</span></span></td>
<td style="height: 30px; width: 100px;"><span class="td-span"><span class="md-plain">✔︎</span></span></td>
<td style="height: 30px; width: 107px;"></td>
<td style="height: 30px; width: 31px;"><span class="td-span"><span class="md-plain">✔︎</span></span></td>
<td style="height: 30px; width: 37px;"></td>
<td style="height: 30px; width: 30px;"></td>
<td style="height: 30px; width: 53px;"></td>
</tr>
<tr class="md-end-block" style="height: 30px;">
<td style="height: 30px; width: 243px;"><span class="td-span"><span class="md-plain">/users/</span></span></td>
<td style="height: 30px; width: 100px;"></td>
<td style="height: 30px; width: 107px;"></td>
<td style="height: 30px; width: 31px;"></td>
<td style="height: 30px; width: 37px;"><span class="td-span"><span class="md-plain">✔︎</span></span></td>
<td style="height: 30px; width: 30px;"></td>
<td style="height: 30px; width: 53px;"></td>
</tr>
<tr class="md-end-block" style="height: 30px;">
<td style="height: 30px; width: 243px;"><span class="td-span"><span class="md-plain">/users/</span><span class="md-pair-s"><code>&lt;username&gt;</code></span></span></td>
<td style="height: 30px; width: 100px;"></td>
<td style="height: 30px; width: 107px;"><span class="td-span"><span class="md-plain">✔︎</span></span></td>
<td style="height: 30px; width: 31px;"><span class="td-span"><span class="md-plain">✔︎</span></span></td>
<td style="height: 30px; width: 37px;"><span class="td-span"><span class="md-plain">✔︎</span></span></td>
<td style="height: 30px; width: 30px;"><span class="td-span"><span class="md-plain">✔︎</span></span></td>
<td style="height: 30px; width: 53px;"><span class="td-span"><span class="md-plain">✔︎</span></span></td>
</tr>
<tr class="md-end-block" style="height: 30px;">
<td style="height: 30px; width: 243px;"><span class="td-span"><span class="md-plain">/activities/</span></span></td>
<td style="height: 30px; width: 100px;"></td>
<td style="height: 30px; width: 107px;"><span class="td-span"><span class="md-plain">✔︎</span></span></td>
<td style="height: 30px; width: 31px;"><span class="td-span"><span class="md-plain">✔︎</span></span></td>
<td style="height: 30px; width: 37px;"><span class="td-span"><span class="md-plain">✔︎</span></span></td>
<td style="height: 30px; width: 30px;"></td>
<td style="height: 30px; width: 53px;"></td>
</tr>
<tr class="md-end-block" style="height: 30px;">
<td style="height: 30px; width: 243px;"><span class="td-span"><span class="md-plain">/activities/</span><span class="md-pair-s"><code>&lt;activity_id&gt;</code></span></span></td>
<td style="height: 30px; width: 100px;"></td>
<td style="height: 30px; width: 107px;"><span class="td-span"><span class="md-plain">✔︎</span></span></td>
<td style="height: 30px; width: 31px;"><span class="td-span"><span class="md-plain">✔︎</span></span></td>
<td style="height: 30px; width: 37px;"></td>
<td style="height: 30px; width: 30px;"><span class="td-span"><span class="md-plain">✔︎</span></span></td>
<td style="height: 30px; width: 53px;"><span class="td-span"><span class="md-plain">✔︎</span></span></td>
</tr>
<tr class="md-end-block" style="height: 30px;">
<td style="height: 30px; width: 243px;"><span class="td-span"><span class="md-plain">/meals/</span></span></td>
<td style="height: 30px; width: 100px;"></td>
<td style="height: 30px; width: 107px;"><span class="td-span"><span class="md-plain">✔︎</span></span></td>
<td style="height: 30px; width: 31px;"><span class="td-span"><span class="md-plain">✔︎</span></span></td>
<td style="height: 30px; width: 37px;"><span class="td-span"><span class="md-plain">✔︎</span></span></td>
<td style="height: 30px; width: 30px;"></td>
<td style="height: 30px; width: 53px;"></td>
</tr>
<tr class="md-end-block" style="height: 30px;">
<td style="height: 30px; width: 243px;"><span class="td-span"><span class="md-plain">/meals/</span><span class="md-pair-s"><code>&lt;meal_id&gt;</code></span></span></td>
<td style="height: 30px; width: 100px;"></td>
<td style="height: 30px; width: 107px;"><span class="td-span"><span class="md-plain">✔︎</span></span></td>
<td style="height: 30px; width: 31px;"><span class="td-span"><span class="md-plain">✔︎</span></span></td>
<td style="height: 30px; width: 37px;"></td>
<td style="height: 30px; width: 30px;"><span class="td-span"><span class="md-plain">✔︎</span></span></td>
<td style="height: 30px; width: 53px;"><span class="td-span"><span class="md-plain">✔︎</span></span></td>
</tr>
<tr class="md-end-block" style="height: 30px;">
<td style="height: 30px; width: 243px;"><span class="td-span"><span class="md-plain">/meals/</span><span class="md-pair-s"><code>&lt;meal_id&gt;</code></span><span class="md-plain">/foods/</span></span></td>
<td style="height: 30px; width: 100px;"></td>
<td style="height: 30px; width: 107px;"><span class="td-span"><span class="md-plain">✔︎</span></span></td>
<td style="height: 30px; width: 31px;"><span class="td-span"><span class="md-plain">✔︎</span></span></td>
<td style="height: 30px; width: 37px;"><span class="td-span"><span class="md-plain">✔︎</span></span></td>
<td style="height: 30px; width: 30px;"></td>
<td style="height: 30px; width: 53px;"></td>
</tr>
<tr class="md-end-block" style="height: 30px;">
<td style="height: 30px; width: 243px;"><span class="td-span"><span class="md-plain">/meals/</span><span class="md-pair-s"><code>&lt;meal_id&gt;</code></span><span class="md-plain">/foods/</span><span class="md-pair-s"><code>&lt;food_id&gt;</code></span></span></td>
<td style="height: 30px; width: 100px;"></td>
<td style="height: 30px; width: 107px;"><span class="td-span"><span class="md-plain">✔︎</span></span></td>
<td style="height: 30px; width: 31px;"><span class="td-span"><span class="md-plain">✔︎</span></span></td>
<td style="height: 30px; width: 37px;"></td>
<td style="height: 30px; width: 30px;"><span class="td-span"><span class="md-plain">✔︎</span></span></td>
<td style="height: 30px; width: 53px;"><span class="td-span"><span class="md-plain">✔︎</span></span></td>
</tr>
<tr class="md-end-block" style="height: 30px;">
<td style="height: 30px; width: 243px;"><span class="td-span"><span class="md-plain">/foods/</span></span></td>
<td style="height: 30px; width: 100px;"></td>
<td style="height: 30px; width: 107px;"></td>
<td style="height: 30px; width: 31px;"><span class="td-span"><span class="md-plain">✔︎</span></span></td>
<td style="height: 30px; width: 37px;"></td>
<td style="height: 30px; width: 30px;"></td>
<td style="height: 30px; width: 53px;"></td>
</tr>
<tr class="md-end-block" style="height: 30px;">
<td style="height: 30px; width: 243px;"><span class="td-span"><span class="md-plain">/foods/</span><span class="md-pair-s"><code>food_id</code></span></span></td>
<td style="height: 30px; width: 100px;"></td>
<td style="height: 30px; width: 107px;"></td>
<td style="height: 30px; width: 31px;"><span class="td-span"><span class="md-plain">✔︎</span></span></td>
<td style="height: 30px; width: 37px;"></td>
<td style="height: 30px; width: 30px;"></td>
<td style="height: 30px; width: 53px;"></td>
</tr>
</tbody>
</table>
</figure>
