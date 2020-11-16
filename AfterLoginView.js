import React from 'react';

import TodayView from './TodayView';
import ExercisesView from './ExercisesView';
import MealsView from './MealsView';
import ProfileView from './ProfileView';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { StyleSheet, Alert, View } from 'react-native';
import { Icon } from 'react-native-elements';

class AfterLoginView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: "",
            lastName: "",
            goalDailyCalories: 0.0,
            goalDailyProtein: 0.0,
            goalDailyCarbohydrates: 0.0,
            goalDailyFat: 0.0,
            goalDailyActivity: 0.0,
            todayActivityList: [],
            totalMins: 0.0,
            totalCalsBurned: 0.0,
            todayMealList: [],
            totalCals: 0.0,
            totalCarbs: 0.0,
            totalFat: 0.0,
            totalProtein: 0.0,
        }
        this.changeGoal = this.changeGoal.bind(this);
        this.updateActivityList = this.updateActivityList.bind(this);
        this.updateMealList = this.updateMealList.bind(this);
    }

    changeGoal(firstName, lastName, cal, pro, carb, fat, mins) {
        this.setState({
            firstName: firstName,
            lastName: lastName,
            goalDailyCalories: cal,
            goalDailyProtein: pro,
            goalDailyCarbohydrates: carb,
            goalDailyFat: fat,
            goalDailyActivity: mins
        });
    }

    updateActivityList(list) {
        let ls = [];
        let today = new Date();
        let updatedMins = 0.0;
        let updatedCals = 0.0;
        for (let i = 0; i < list.length; i++) {
            let activityDate = new Date(list[i]["date"]);
            if (today.getFullYear() === activityDate.getFullYear() &&
                today.getMonth() === activityDate.getMonth() &&
                today.getDate() === activityDate.getDate()) {
                ls.push(list[i]);
                updatedMins += list[i]["duration"];
                updatedCals += list[i]["calories"]
            }
        }
        this.setState({
            todayActivityList: ls,
            totalMins: updatedMins,
            totalCalsBurned: updatedCals,
        })
    }

    updateMealList(list) {
        let ls = [];
        let today = new Date();
        let updatedCal = 0.0;
        let updatedCarb = 0.0;
        let updatedFat = 0.0;
        let updatedProtein = 0.0;
        for (let i = 0; i < list.length; i++) {
            let activityDate = new Date(list[i]["date"]);
            if (today.getFullYear() === activityDate.getFullYear() &&
                today.getMonth() === activityDate.getMonth() &&
                today.getDate() === activityDate.getDate()) {
                ls.push(list[i]);
                updatedCal += list[i]["cals"];
                updatedCarb += list[i]["carbs"];
                updatedProtein += list[i]["protein"];
                updatedFat += list[i]["fat"];
            }
        }
        this.setState({
            todayMealList: ls,
            totalCals: updatedCal,
            totalCarbs: updatedCarb,
            totalFat: updatedFat,
            totalProtein: updatedProtein,
        })
    }

    componentDidMount() {
        fetch('https://mysqlcs639.cs.wisc.edu/users/' + this.props.username, {
            method: 'GET',
            headers: { 'x-access-token': this.props.accessToken }
        })
            .then(res => res.json())
            .then(res => {
                if (res.message === "Token is invalid!") {
                    Alert.alert(
                        "Request Timeout",
                        "Please re-login to continue.",
                        [
                            {
                                text: "OK", onPress: () => this.props.revokeAccessToken()
                            }
                        ],
                        { cancelable: false }
                    );
                } else {
                    this.setState({
                        firstName: res.firstName,
                        lastName: res.lastName,
                        goalDailyCalories: res.goalDailyCalories,
                        goalDailyProtein: res.goalDailyProtein,
                        goalDailyCarbohydrates: res.goalDailyCarbohydrates,
                        goalDailyFat: res.goalDailyFat,
                        goalDailyActivity: res.goalDailyActivity
                    });
                }
            });

        fetch('https://mysqlcs639.cs.wisc.edu/activities/', {
            method: 'GET',
            headers: { 'x-access-token': this.props.accessToken }
        })
            .then(res => res.json())
            .then(res => {
                let ls = [];
                let list = res["activities"];
                let today = new Date();
                let updatedMins = 0.0;
                let updatedCals = 0.0;
                for (let i = 0; i < list.length; i++) {
                    let activityDate = new Date(list[i]["date"]);
                    if (today.getFullYear() === activityDate.getFullYear() &&
                        today.getMonth() === activityDate.getMonth() &&
                        today.getDate() === activityDate.getDate()) {
                        ls.push(list[i]);
                        updatedMins += list[i]["duration"];
                        updatedCals += list[i]["calories"];
                    }
                }
                this.setState({
                    todayActivityList: ls,
                    totalMins: updatedMins,
                    totalCalsBurned: updatedCals,
                })
            });

        let tempCals = 0.0;
        let tempCarbs = 0.0;
        let tempProtein = 0.0;
        let tempFat = 0.0;
        fetch('https://mysqlcs639.cs.wisc.edu/meals/', {
            method: 'GET',
            headers: { 'x-access-token': this.props.accessToken }
        })
            .then(res => res.json())
            .then(res => {
                let ls = [];
                let list = res["meals"];
                let today = new Date();
                for (let i = 0; i < list.length; i++) {
                    let activityDate = new Date(list[i]["date"]);
                    if (today.getFullYear() === activityDate.getFullYear() &&
                        today.getMonth() === activityDate.getMonth() &&
                        today.getDate() === activityDate.getDate()) {
                        ls.push(list[i])
                    }
                }
                this.setState({
                    todayMealList: ls,
                });

                let tempMealList = ls;
                let urls = [];
                for (let i = 0; i < tempMealList.length; i++) {
                    tempMealList[i]["foods"] = [];
                    tempMealList[i]["cals"] = 0.0;
                    tempMealList[i]["carbs"] = 0.0;
                    tempMealList[i]["protein"] = 0.0;
                    tempMealList[i]["fat"] = 0.0;
                    urls.push('https://mysqlcs639.cs.wisc.edu/meals/' + tempMealList[i]["id"] + "/foods/")
                }
                Promise.all(urls.map(url => fetch(url, {
                    method: 'GET',
                    headers: { 'x-access-token': this.props.accessToken }
                }).then(async res => {
                    let json = await res.json();
                    json["id"] = parseInt(res.url.split("/").slice(-3, -2)[0]);
                    return json;
                })
                )).then((res) => {
                    for (let i = 0; i < res.length; i++) {
                        for (let j = 0; j < tempMealList.length; j++) {
                            if (res[i]["id"] === tempMealList[j]["id"]) {
                                tempMealList[j]["foods"] = res[i]["foods"];
                                let cals = 0.0;
                                let carbs = 0.0;
                                let proteins = 0.0;
                                let fats = 0.0;
                                for (let k = 0; k < res[i]["foods"].length; k++) {
                                    cals += res[i]["foods"][k]["calories"];
                                    carbs += res[i]["foods"][k]["carbohydrates"];
                                    proteins += res[i]["foods"][k]["protein"];
                                    fats += res[i]["foods"][k]["fat"];
                                }
                                tempMealList[j]["cals"] = cals;
                                tempMealList[j]["carbs"] = carbs;
                                tempMealList[j]["protein"] = proteins;
                                tempMealList[j]["fat"] = fats;
                                tempCals += cals;
                                tempCarbs += carbs;
                                tempProtein += proteins;
                                tempFat += fats;
                                break;
                            }
                        }
                    }
                    return tempMealList
                })
                    .then(tempMealList => {
                        this.setState({
                            todayMealList: tempMealList,
                            totalCals: tempCals,
                            totalCarbs: tempCarbs,
                            totalProtein: tempProtein,
                            totalFat: tempFat,
                        });
                    });
            })
    }

    render() {
        let BottomTab = createBottomTabNavigator();
        return <>
            <BottomTab.Navigator
                tabBarOptions={{
                    activeTintColor: '#5e60ce',
                    inactiveTintColor: '#5390d9',
                }}
            >
                <>
                    <BottomTab.Screen
                        name="Today"
                        options={{
                            tabBarLabel: 'Today',
                            tabBarIcon: ({ focused }) => {
                                if (focused) {
                                    return <Icon
                                        name='ios-sunny'
                                        type='ionicon'
                                        color='#5e60ce'
                                    />
                                } else {
                                    return <Icon
                                        name='ios-sunny'
                                        type='ionicon'
                                        color='#5390d9'
                                    />
                                }
                            },
                        }}
                    >
                        {(props) => <TodayView {...props}
                            username={this.props.username}
                            accessToken={this.props.accessToken}
                            revokeAccessToken={this.props.revokeAccessToken}
                            goalDailyActivity={this.state.goalDailyActivity}
                            todayActivityList={this.state.todayActivityList}
                            totalMins={this.state.totalMins}
                            todayMealList={this.state.todayMealList}
                            totalCals={this.state.totalCals}
                            totalCarbs={this.state.totalCarbs}
                            totalProtein={this.state.totalProtein}
                            totalFat={this.state.totalFat}
                            goalDailyCalories={this.state.goalDailyCalories}
                            goalDailyCarbohydrates={this.state.goalDailyCarbohydrates}
                            goalDailyProtein={this.state.goalDailyProtein}
                            goalDailyFat={this.state.goalDailyFat}
                            totalCalsBurned={this.state.totalCalsBurned}
                            logoutConfirmation={this.props.logoutConfirmation}
                        />}
                    </BottomTab.Screen>
                    <BottomTab.Screen
                        name="Exercises"
                        options={{
                            tabBarLabel: 'Exercises',
                            tabBarIcon: ({ focused }) => {
                                if (focused) {
                                    return <Icon
                                        name='running'
                                        type='font-awesome-5'
                                        color='#5e60ce'
                                    />
                                } else {
                                    return <Icon
                                        name='running'
                                        type='font-awesome-5'
                                        color='#5390d9'
                                    />
                                }
                            }
                        }}
                    >
                        {(props) => <ExercisesView {...props} username={this.props.username} accessToken={this.props.accessToken} revokeAccessToken={this.props.revokeAccessToken} updateActivityList={this.updateActivityList} logoutConfirmation={this.props.logoutConfirmation}/>}
                    </BottomTab.Screen>
                    <BottomTab.Screen
                        name="Meals"
                        options={{
                            tabBarLabel: 'Meals',
                            tabBarIcon: ({ focused }) => {
                                if (focused) {
                                    return <Icon
                                        name='ios-restaurant'
                                        type='ionicon'
                                        color='#5e60ce'
                                    />
                                } else {
                                    return <Icon
                                        name='ios-restaurant'
                                        type='ionicon'
                                        color='#5390d9'
                                    />
                                }
                            }
                        }}
                    >
                        {(props) => <MealsView {...props} username={this.props.username} accessToken={this.props.accessToken} revokeAccessToken={this.props.revokeAccessToken} updateMealList={this.updateMealList} logoutConfirmation={this.props.logoutConfirmation}/>}
                    </BottomTab.Screen>
                    <BottomTab.Screen
                        name="Profile"
                        options={{
                            tabBarLabel: 'Profile',
                            tabBarIcon: ({ focused }) => {
                                if (focused) {
                                    return <Icon
                                        name='ios-person'
                                        type='ionicon'
                                        color='#5e60ce'
                                    />
                                } else {
                                    return <Icon
                                        name='ios-person'
                                        type='ionicon'
                                        color='#5390d9'
                                    />
                                }
                            }
                        }}
                    >
                        {(props) => <ProfileView {...props} username={this.props.username} accessToken={this.props.accessToken} revokeAccessToken={this.props.revokeAccessToken} changeGoal={this.changeGoal} logoutConfirmation={this.props.logoutConfirmation}/>}
                    </BottomTab.Screen>
                </>
            </BottomTab.Navigator>
        </>
    }
}

const styles = StyleSheet.create({

});

export default AfterLoginView;