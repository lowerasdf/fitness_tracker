import React from 'react';
import { StyleSheet, Text, View, Button, ScrollView, TouchableOpacity, TextInput, Alert, Picker } from 'react-native';
import { Card, CardItem, Body, List, ListItem } from 'native-base'
import { Overlay } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Icon } from 'react-native-elements';

class MealsView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mealList: [],
            foodList: [],
            showAddModal: false,
            addNewCal: "",
            addNewName: "",
            addNewCarb: "",
            addNewProtein: "",
            addNewFat: "",
            addNewDateTime: new Date(),
            mode: "date",
            addMode: true,
            editID: "",
            showAddFoodModal: false,
            highlightedMeal: "",
            highlightedDate: "",
            addNewFood: 0,
            showAddNewFoodModal: false,
            editFoodID: "",
        }

        this.addMealModal = this.addMealModal.bind(this);
        this.handleAddMeal = this.handleAddMeal.bind(this);
        this.deleteAlert = this.deleteAlert.bind(this);
        this.handleDeleteMeal = this.handleDeleteMeal.bind(this);
        this.handleUpdateMeal = this.handleUpdateMeal.bind(this);
        this.updateTextInput = this.updateTextInput.bind(this);
        this.addFoodModal = this.addFoodModal.bind(this);
        this.handleAddFood = this.handleAddFood.bind(this);
        this.handleAddNewFood = this.handleAddNewFood.bind(this);
        this.deleteAlertFood = this.deleteAlertFood.bind(this);
        this.handleDeleteFood = this.handleDeleteFood.bind(this);
        this.updateTextInputFood = this.updateTextInputFood.bind(this);
        this.handleUpdateFood = this.handleUpdateFood.bind(this);
    }

    componentDidMount() {
        fetch('https://mysqlcs639.cs.wisc.edu/meals/', {
            method: 'GET',
            headers: { 'x-access-token': this.props.accessToken }
        })
            .then(res => res.json())
            .then(res => {
                let tempMealList = res["meals"];
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
                                break;
                            }
                        }
                    }
                    return tempMealList
                })
                    .then(tempMealList => {
                        this.setState({
                            mealList: tempMealList,
                        });
                    });
            });

        fetch('https://mysqlcs639.cs.wisc.edu/foods/', {
            method: 'GET',
        })
            .then(res => res.json())
            .then(res => {
                this.setState({
                    foodList: res["foods"],
                    addNewFood: res["foods"][0]["id"]
                });
            });
    }

    deleteAlertFood(id, mealid, name) {
        Alert.alert(
            'Delete ' + name + '?',
            'Once deleted, this action cannot be reverted',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Delete', onPress: () => this.handleDeleteFood(id, mealid, name)
                }
            ],
            { cancelable: false }
        );
    }

    handleDeleteFood(id, mealid, name) {
        fetch('https://mysqlcs639.cs.wisc.edu/meals/' + mealid + '/foods/' + id, {
            method: 'DELETE',
            headers: {
                'x-access-token': this.props.accessToken
            }
        })
            .then(res => res.json())
            .then(res => {
                if (res.message === "Food deleted!") {
                    let updatedList = JSON.parse(JSON.stringify(this.state.mealList));
                    for (var i = updatedList.length - 1; i >= 0; i--) {
                        if (updatedList[i]["id"] === mealid) {
                            for (var j = updatedList[i]["foods"].length - 1; j >= 0; j--) {
                                if (updatedList[i]["foods"][j]["id"] === id) {
                                    updatedList[i]["cals"] -= updatedList[i]["foods"][j]["calories"];
                                    updatedList[i]["carbs"] -= updatedList[i]["foods"][j]["carbohydrates"];
                                    updatedList[i]["protein"] -= updatedList[i]["foods"][j]["protein"];
                                    updatedList[i]["fat"] -= updatedList[i]["foods"][j]["fat"];
                                    updatedList[i]["foods"].splice(j, 1);
                                    break;
                                }
                            }
                            break;
                        }
                    }
                    this.setState({
                        mealList: updatedList
                    });
                    this.props.updateMealList(this.state.mealList);
                    Alert.alert(
                        "Food deleted from this meal!",
                        name + " has been deleted.",
                        [
                            {
                                text: "OK"
                            }
                        ],
                        { cancelable: false }
                    );
                } else if (res.message === "Token is invalid!") {
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
                    alert(JSON.stringify(res.message));
                }
            });
    }

    deleteAlert(id, name) {
        Alert.alert(
            'Delete ' + name + '?',
            'Once deleted, this action cannot be reverted',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Delete', onPress: () => this.handleDeleteMeal(id, name)
                }
            ],
            { cancelable: false }
        );
    }

    handleDeleteMeal(id, name) {
        fetch('https://mysqlcs639.cs.wisc.edu/meals/' + id, {
            method: 'DELETE',
            headers: {
                'x-access-token': this.props.accessToken
            }
        })
            .then(res => res.json())
            .then(res => {
                if (res.message === "Meal deleted!") {
                    let updatedList = JSON.parse(JSON.stringify(this.state.mealList));
                    for (var i = updatedList.length - 1; i >= 0; i--) {
                        if (updatedList[i]["id"] === id) {
                            updatedList.splice(i, 1);
                            break;
                        }
                    }
                    this.setState({
                        mealList: updatedList
                    });
                    this.props.updateMealList(this.state.mealList);
                    Alert.alert(
                        "Meal deleted!",
                        name + " has been deleted.",
                        [
                            {
                                text: "OK", onPress: () => this.setState({
                                    showAddModal: false,
                                })
                            }
                        ],
                        { cancelable: false }
                    );
                } else if (res.message === "Token is invalid!") {
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
                    alert(JSON.stringify(res.message));
                }
            });
    }

    updateTextInputFood(id, mealid) {
        for (let i = 0; i < this.state.mealList.length; i++) {
            if (this.state.mealList[i]["id"] === mealid) {
                for (let j = 0; j < this.state.mealList[i]["foods"].length; j++) {
                    if (this.state.mealList[i]["foods"][j]["id"] === id) {
                        this.setState({
                            addNewName: this.state.mealList[i]["foods"][j]["name"],
                            addNewCal: this.state.mealList[i]["foods"][j]["calories"],
                            addNewCarb: this.state.mealList[i]["foods"][j]["carbohydrates"],
                            addNewProtein: this.state.mealList[i]["foods"][j]["protein"],
                            addNewFat: this.state.mealList[i]["foods"][j]["fat"],
                        })
                        break;
                    }
                }
                break;
            }
        }
        this.setState({ showAddNewFoodModal: true, addMode: false, editID: mealid, editFoodID: id });
    }

    handleUpdateFood() {
        fetch('https://mysqlcs639.cs.wisc.edu/meals/' + this.state.editID + '/foods/' + this.state.editFoodID, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': this.props.accessToken
            },
            body: JSON.stringify({
                name: this.state.addNewName === "" ? "New Food" : this.state.addNewName,
                calories: this.parseInput(this.state.addNewCal),
                carbohydrates: this.parseInput(this.state.addNewCarb),
                protein: this.parseInput(this.state.addNewProtein),
                fat: this.parseInput(this.state.addNewFat)
            })
        })
            .then(res => res.json())
            .then(res => {
                if (res.message === "Food updated!") {
                    let updatedList = JSON.parse(JSON.stringify(this.state.mealList));
                    let oldName = "";
                    for (var i = updatedList.length - 1; i >= 0; i--) {
                        if (updatedList[i]["id"] === this.state.editID) {
                            for (var j = updatedList[i]["foods"].length - 1; j >= 0; j--) {
                                if (updatedList[i]["foods"][j]["id"] === this.state.editFoodID) {
                                    oldName = updatedList[i]["foods"][j]["name"];
                                    updatedList[i]["cals"] = updatedList[i]["cals"] - updatedList[i]["foods"][j]["calories"] + this.parseInput(this.state.addNewCal);
                                    updatedList[i]["carbs"] = updatedList[i]["carbs"] - updatedList[i]["foods"][j]["carbohydrates"] + this.parseInput(this.state.addNewCarb);
                                    updatedList[i]["protein"] = updatedList[i]["protein"] - updatedList[i]["foods"][j]["protein"] + this.parseInput(this.state.addNewProtein);
                                    updatedList[i]["fat"] = updatedList[i]["fat"] - updatedList[i]["foods"][j]["fat"] + this.parseInput(this.state.addNewFat);
                                    updatedList[i]["foods"][j]["name"] = this.state.addNewName === "" ? "New Food" : this.state.addNewName;
                                    updatedList[i]["foods"][j]["calories"] = this.parseInput(this.state.addNewCal);
                                    updatedList[i]["foods"][j]["carbohydrates"] = this.parseInput(this.state.addNewCarb);
                                    updatedList[i]["foods"][j]["protein"] = this.parseInput(this.state.addNewProtein);
                                    updatedList[i]["foods"][j]["fat"] = this.parseInput(this.state.addNewFat);
                                    break;
                                }
                            }
                            break;
                        }
                    }
                    this.setState({
                        mealList: updatedList
                    });
                    this.props.updateMealList(this.state.mealList);
                    Alert.alert(
                        "Food updated!",
                        oldName + " has been updated.",
                        [
                            {
                                text: "OK", onPress: () => this.setState({
                                    showAddNewFoodModal: false,
                                    addNewName: "",
                                    addNewCal: "",
                                    addNewCarb: "",
                                    addNewProtein: "",
                                    addNewFat: ""
                                })
                            }
                        ],
                        { cancelable: false }
                    );
                } else if (res.message === "Token is invalid!") {
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
                    alert(JSON.stringify(res.message));
                }
            });
    }

    updateTextInput(id) {
        for (let i = 0; i < this.state.mealList.length; i++) {
            if (this.state.mealList[i]["id"] === id) {
                this.setState({
                    addNewDateTime: new Date(this.state.mealList[i]["date"]),
                    addNewName: this.state.mealList[i]["name"],
                })
                break;
            }
        }
        this.setState({ showAddModal: true, addMode: false, editID: id });
    }

    handleUpdateMeal() {
        fetch('https://mysqlcs639.cs.wisc.edu/meals/' + this.state.editID, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': this.props.accessToken
            },
            body: JSON.stringify({
                date: this.state.addNewDateTime,
                name: this.state.addNewName === "" ? "New Meal" : this.state.addNewName,
            })
        })
            .then(res => res.json())
            .then(res => {
                if (res.message === "Meal updated!") {
                    let updatedList = JSON.parse(JSON.stringify(this.state.mealList));
                    let oldName = "";
                    for (var i = updatedList.length - 1; i >= 0; i--) {
                        if (updatedList[i]["id"] === this.state.editID) {
                            updatedList[i]["date"] = this.state.addNewDateTime;
                            oldName = updatedList[i]["name"];
                            updatedList[i]["name"] = this.state.addNewName === "" ? "New Meal" : this.state.addNewName;
                            break;
                        }
                    }
                    this.setState({
                        mealList: updatedList
                    });
                    this.props.updateMealList(this.state.mealList);
                    Alert.alert(
                        "Meal updated!",
                        oldName + " has been updated.",
                        [
                            {
                                text: "OK", onPress: () => this.setState({
                                    showAddModal: false,
                                    addNewName: "",
                                    addNewDateTime: new Date(),
                                    mode: "date",
                                })
                            }
                        ],
                        { cancelable: false }
                    );
                } else if (res.message === "Token is invalid!") {
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
                    alert(JSON.stringify(res.message));
                }
            });
    }

    handleAddMeal() {
        fetch('https://mysqlcs639.cs.wisc.edu/meals/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': this.props.accessToken
            },
            body: JSON.stringify({
                date: this.state.addNewDateTime,
                name: this.state.addNewName === "" ? "New Meal" : this.state.addNewName,
            })
        })
            .then(res => res.json())
            .then(res => {
                if (res.message === "Meal created!") {
                    this.setState(prevState => {
                        return ({
                            mealList: [...prevState.mealList, {
                                id: res.id,
                                date: this.state.addNewDateTime,
                                name: this.state.addNewName === "" ? "New Meal" : this.state.addNewName,
                                cals: 0.0,
                                carbs: 0.0,
                                protein: 0.0,
                                fat: 0.0,
                                foods: [],
                            }]
                        });
                    })
                    this.props.updateMealList(this.state.mealList);
                    Alert.alert(
                        (this.state.addNewName === "" ? "New Meal" : this.state.addNewName) + " has been created.",
                        "Start adding food to this meal by clicking the Add Food button on each meal.",
                        [
                            {
                                text: "OK", onPress: () => this.setState({
                                    showAddModal: false,
                                    addNewName: "",
                                    addNewDateTime: new Date(),
                                    mode: "date",
                                })
                            }
                        ],
                        { cancelable: false }
                    );
                } else if (res.message === "Token is invalid!") {
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
                    alert(JSON.stringify(res.message));
                }
            });
    }

    handleAddFood() {
        let name = "";
        let cals = 0.0;
        let carbs = 0.0;
        let protein = 0.0;
        let fat = 0.0;
        for (let i = 0; i < this.state.foodList.length; i++) {
            if (this.state.addNewFood === this.state.foodList[i]["id"]) {
                name = this.state.foodList[i]["name"];
                cals = this.state.foodList[i]["calories"];
                carbs = this.state.foodList[i]["carbohydrates"];
                protein = this.state.foodList[i]["protein"];
                fat = this.state.foodList[i]["fat"];
                break;
            }
        }

        fetch('https://mysqlcs639.cs.wisc.edu/meals/' + this.state.editID + "/foods/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': this.props.accessToken
            },
            body: JSON.stringify({
                name: name,
                calories: cals,
                carbohydrates: carbs,
                protein: protein,
                fat: fat
            })
        })
            .then(res => res.json())
            .then(res => {
                if (res.message === "Food created!") {
                    let updatedList = JSON.parse(JSON.stringify(this.state.mealList));
                    for (var i = updatedList.length - 1; i >= 0; i--) {
                        if (updatedList[i]["id"] === this.state.editID) {
                            updatedList[i]["foods"].push({
                                id: res["id"],
                                name: name,
                                calories: cals,
                                carbohydrates: carbs,
                                protein: protein,
                                fat: fat
                            })
                            updatedList[i]["cals"] += cals;
                            updatedList[i]["carbs"] += carbs;
                            updatedList[i]["protein"] += protein;
                            updatedList[i]["fat"] += fat;
                        }
                    }
                    this.setState({
                        mealList: updatedList
                    });
                    this.props.updateMealList(this.state.mealList);
                    Alert.alert(
                        "Success!",
                        (name === "" ? "New Food" : name) + " has been added to this meal.",
                        [
                            {
                                text: "OK", onPress: () => this.setState({
                                    showAddFoodModal: false,
                                })
                            }
                        ],
                        { cancelable: false }
                    );
                } else if (res.message === "Token is invalid!") {
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
                    alert(JSON.stringify(res.message));
                }
            });
    }

    parseInput(input) {
        let retVal = parseFloat(input);
        if (isNaN(retVal)) {
            return 0
        }
        return retVal
    }

    handleAddNewFood() {
        fetch('https://mysqlcs639.cs.wisc.edu/meals/' + this.state.editID + "/foods/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': this.props.accessToken
            },
            body: JSON.stringify({
                name: this.state.addNewName === "" ? "New Food" : this.state.addNewName,
                calories: this.parseInput(this.state.addNewCal),
                carbohydrates: this.parseInput(this.state.addNewCarb),
                protein: this.parseInput(this.state.addNewProtein),
                fat: this.parseInput(this.state.addNewFat)
            })
        })
            .then(res => res.json())
            .then(res => {
                if (res.message === "Food created!") {
                    let updatedList = JSON.parse(JSON.stringify(this.state.mealList));
                    for (var i = updatedList.length - 1; i >= 0; i--) {
                        if (updatedList[i]["id"] === this.state.editID) {
                            updatedList[i]["foods"].push({
                                id: res["id"],
                                name: this.state.addNewName === "" ? "New Food" : this.state.addNewName,
                                calories: this.parseInput(this.state.addNewCal),
                                carbohydrates: this.parseInput(this.state.addNewCarb),
                                protein: this.parseInput(this.state.addNewProtein),
                                fat: this.parseInput(this.state.addNewFat)
                            })
                            updatedList[i]["cals"] += this.parseInput(this.state.addNewCal);
                            updatedList[i]["carbs"] += this.parseInput(this.state.addNewCarb);
                            updatedList[i]["protein"] += this.parseInput(this.state.addNewProtein);
                            updatedList[i]["fat"] += this.parseInput(this.state.addNewFat);
                        }
                    }
                    this.setState({
                        mealList: updatedList
                    });
                    this.props.updateMealList(this.state.mealList);
                    Alert.alert(
                        "Success",
                        (this.state.addNewName === "" ? "New Food" : this.state.addNewName) + " has been added to this meal.",
                        [
                            {
                                text: "OK", onPress: () => this.setState({
                                    showAddNewFoodModal: false,
                                    addNewName: "",
                                    addNewCal: "",
                                    addNewCarb: "",
                                    addNewProtein: "",
                                    addNewFat: "",
                                })
                            }
                        ],
                        { cancelable: false }
                    );
                } else if (res.message === "Token is invalid!") {
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
                    alert(JSON.stringify(res.message));
                }
            });
    }

    render() {
        return <>
            <ScrollView style={styles.mainContainer} contentContainerStyle={{ flexGrow: 11, justifyContent: 'center', alignItems: "center" }}>
                {this.addMealModal()}
                {this.addFoodModal()}
                {this.addNewFoodModal()}
                <View style={styles.space} />
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    <Icon name="ios-restaurant" type='ionicon' size={45} color="#5e60ce" style={{ marginRight: 10 }} />
                    <Text style={styles.bigText}>Meals</Text>
                </View>
                <View>
                    <Text>Start eating healthy foods today!</Text>
                </View>
                <View>
                    <Text>Record your meals & foods below.</Text>
                </View>
                <View style={styles.space} />
                <View>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => this.setState({ showAddModal: true, addMode: true })}
                    >
                        <Icon
                            name='ios-add'
                            type='ionicon'
                            color='white'
                        />
                        <Text style={styles.whiteText}>Add Meal</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.space} />
                <View style={{ width: "90%" }}>
                    {
                        this.state.mealList.length != 0 ? this.state.mealList.map((item, key) => (
                            <Card key={key} >
                                <CardItem bordered>
                                    <Body style={{ flexDirection: "row" }}>
                                        <Text style={{ textAlignVertical: "center", fontWeight: "700", fontSize: 20 }}>{item["name"]}</Text>
                                        <View style={{ flex: "1" }}></View>
                                        <TouchableOpacity onPress={() => this.updateTextInput(item["id"])}>
                                            <Icon
                                                name='ios-create'
                                                type='ionicon'
                                                color='black'
                                                size={28}
                                            />
                                        </TouchableOpacity>
                                        <View style={{ flex: "0.08" }}></View>
                                        <TouchableOpacity onPress={() => this.deleteAlert(item["id"], item["name"])}>
                                            <Icon
                                                name='ios-trash'
                                                type='ionicon'
                                                color='black'
                                                size={30}
                                            />
                                        </TouchableOpacity>
                                    </Body>
                                </CardItem>
                                <CardItem bordered>
                                    <Body>
                                        <Text style={styles.cardText}>Date: {(new Date(item["date"])).toString().slice(0, -15)}</Text>
                                        <Text style={styles.cardText}>Calories: {item["cals"]} kcal</Text>
                                        <Text style={styles.cardText}>Carbs: {item["carbs"]} gr</Text>
                                        <Text style={styles.cardText}>Protein: {item["protein"]} gr</Text>
                                        <Text style={styles.cardText}>Fat: {item["fat"]} gr</Text>
                                    </Body>
                                </CardItem>
                                <CardItem bordered>
                                    <Body>
                                        {

                                            item["foods"] !== undefined && item["foods"].length != 0 ?
                                                <List>
                                                    {
                                                        item["foods"].map((food, foodkey) => (
                                                            <ListItem key={foodkey}>
                                                                <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "left", width: "100%" }}>
                                                                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 5 }}>
                                                                        <Text style={{ fontSize: 16, fontWeight: "600" }}>{food["name"]} </Text>
                                                                        <View style={{ flex: "1" }}></View>
                                                                        <TouchableOpacity onPress={() => this.updateTextInputFood(food["id"], item["id"])}>
                                                                            <Icon
                                                                                name='ios-create'
                                                                                type='ionicon'
                                                                                color='black'
                                                                                size={24}
                                                                            />
                                                                        </TouchableOpacity>
                                                                        <View style={{ flex: "0.08" }}></View>
                                                                        <TouchableOpacity onPress={() => this.deleteAlertFood(food["id"], item["id"], food["name"])}>
                                                                            <Icon
                                                                                name='ios-trash'
                                                                                type='ionicon'
                                                                                color='black'
                                                                                size={26}
                                                                            />
                                                                        </TouchableOpacity>
                                                                    </View>
                                                                    <View>
                                                                        <Text>{food["calories"]} kcal, {food["carbohydrates"]} gr Carbs, {food["protein"]} gr Protein, {food["fat"]} gr Fat</Text>
                                                                    </View>
                                                                </View>
                                                            </ListItem>
                                                        ))
                                                    }
                                                </List>
                                                :
                                                <View>
                                                    <Text style={{ fontStyle: "italic", textAlign: "center" }}>You don't have any food for this meal!</Text>
                                                    <Text style={{ fontStyle: "italic", textAlign: "center" }}>Start adding food by clicking the "+" sign on this meal.</Text>
                                                </View>
                                        }
                                    </Body>
                                </CardItem>
                                <CardItem>
                                    <Body style={{ justifyContent: "center", alignItems: "center", flexDirection: "row", alignContent: "center" }}>
                                        <TouchableOpacity onPress={() => this.setState({ showAddFoodModal: true, editID: item["id"], highlightedMeal: item["name"], highlightedDate: (new Date(item["date"])).toString().slice(0, -15) })} style={{ justifyContent: "center", alignItems: "center", flexDirection: "row" }}>
                                            <Icon
                                                name='ios-add'
                                                type='ionicon'
                                                color='#007AFF'
                                                size={32}
                                            />
                                            <Text style={{ color: "#007AFF" }}> Add Food</Text>
                                        </TouchableOpacity>
                                    </Body>
                                </CardItem>
                            </Card>
                        ))
                            :
                            <View style={{ width: "100%" }}>
                                <Text style={{ fontStyle: "italic", textAlign: "center" }}>You don't have any meal!</Text>
                                <Text style={{ fontStyle: "italic", textAlign: "center" }}>Start adding meal by clicking the "Add Meal" button above.</Text>
                            </View>
                    }
                </View>
            </ScrollView>
        </>
    }

    addFoodModal() {
        return <>
            <View>
                <Overlay isVisible={this.state.showAddFoodModal} onBackdropPress={() => { this.setState({ showAddFoodModal: false }) }} overlayStyle={{ width: "90%", height: "70%", justifyContent: "center", alignItems: "center" }}>
                    <View style={{ width: "100%", justifyContent: "center", alignItems: "center" }}>
                        <View style={{ alignItems: "center", justifyContent: "center" }}>
                            <Text style={{ textAlignVertical: "center", fontWeight: "700", fontSize: 20 }}>Add Food</Text>
                            <Text style={{ textAlignVertical: "center" }}>{this.state.highlightedMeal}</Text>
                            <Text style={{ textAlignVertical: "center" }}>{this.state.highlightedDate}</Text>
                            <View style={styles.spaceSmall}></View>
                        </View>
                        <View style={{ height: "55%", paddingBottom: 100 }}>
                            <Picker
                                selectedValue={this.state.addNewFood}
                                style={{ width: 300 }}
                                onValueChange={(itemValue, itemIndex) => { this.setState({ addNewFood: itemValue }) }}
                            >
                                {
                                    this.state.foodList.map((food, foodkey) => (
                                        <Picker.Item label={food["name"] + " (" + food["calories"] + " kcal)"} value={food["id"]} key={foodkey} />
                                    ))
                                }
                            </Picker>
                        </View>
                        <View style={{ flexDirection: "row", marginBottom: 40 }}>
                            <TouchableOpacity style={styles.button} onPress={this.handleAddFood}>
                                <Text style={styles.insideButton}>Add Food</Text>
                            </TouchableOpacity>
                            <View style={{ width: "1%" }} />
                            <TouchableOpacity style={styles.button} onPress={() => {
                                this.setState({
                                    showAddFoodModal: false
                                })
                            }}>
                                <Text style={styles.insideButton}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <TouchableOpacity onPress={() => {
                                this.setState({
                                    showAddFoodModal: false,
                                    showAddNewFoodModal: true,
                                })
                            }}>
                                <Text style={{ color: "#007AFF" }}>
                                    Couldn't find what you're craving for?
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Overlay>
            </View>
        </>
    }

    addNewFoodModal() {
        return <>
            <View>
                <Overlay isVisible={this.state.showAddNewFoodModal} onBackdropPress={() => { this.setState({ showAddNewFoodModal: false }) }} overlayStyle={{ width: "90%", height: "70%", justifyContent: "center", alignItems: "center" }}>
                    <View style={{ width: "100%", justifyContent: "center", alignItems: "center" }}>
                        <View>
                            <Text style={{ textAlignVertical: "center", fontWeight: "700", fontSize: 20 }}>{this.state.addMode ? "Add Custom Food" : "Edit Food"}</Text>
                            <View style={styles.spaceSmall}></View>
                        </View>
                        <View>
                            <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>Name</Text>
                        </View>
                        <TextInput style={styles.input}
                            placeholder="e.g. Salad, Sushi"
                            placeholderTextColor="#d9bebd"
                            onChangeText={(addNewName) => this.setState({ addNewName: addNewName })}
                            value={this.state.addNewName + ""} />
                        <View>
                            <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>Calories (kcal)</Text>
                        </View>
                        <TextInput style={styles.input}
                            keyboardType="decimal-pad"
                            placeholder="e.g. 300"
                            placeholderTextColor="#d9bebd"
                            onChangeText={(addNewCal) => this.setState({ addNewCal: addNewCal })}
                            value={this.state.addNewCal + ""} />
                        <View>
                            <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>Carbohydrates (grams)</Text>
                        </View>
                        <TextInput style={styles.input}
                            keyboardType="decimal-pad"
                            placeholder="e.g. 100"
                            placeholderTextColor="#d9bebd"
                            onChangeText={(addNewCarb) => this.setState({ addNewCarb: addNewCarb })}
                            value={this.state.addNewCarb + ""} />
                        <View>
                            <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>Protein (grams)</Text>
                        </View>
                        <TextInput style={styles.input}
                            keyboardType="decimal-pad"
                            placeholder="e.g. 50"
                            placeholderTextColor="#d9bebd"
                            onChangeText={(addNewProtein) => this.setState({ addNewProtein: addNewProtein })}
                            value={this.state.addNewProtein + ""} />
                        <View>
                            <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>Fat (grams)</Text>
                        </View>
                        <TextInput style={styles.input}
                            keyboardType="decimal-pad"
                            placeholder="e.g. 20"
                            placeholderTextColor="#d9bebd"
                            onChangeText={(addNewFat) => this.setState({ addNewFat: addNewFat })}
                            value={this.state.addNewFat + ""} />
                        <View style={styles.space}></View>
                        <View style={{ flexDirection: "row" }}>
                            {
                                this.state.addMode ?
                                    <TouchableOpacity style={styles.button} onPress={this.handleAddNewFood}>
                                        <Text style={styles.insideButton}>Add Food</Text>
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity style={styles.button} onPress={this.handleUpdateFood}>
                                        <Text style={styles.insideButton}>Save Food</Text>
                                    </TouchableOpacity>
                            }
                            <View style={{ width: "1%" }} />
                            <TouchableOpacity style={styles.button} onPress={() => {
                                this.setState({
                                    showAddNewFoodModal: false
                                })
                            }}>
                                <Text style={styles.insideButton}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Overlay>
            </View>
        </>
    }

    addMealModal() {
        return <>
            <View>
                <Overlay isVisible={this.state.showAddModal} onBackdropPress={() => { this.setState({ showAddModal: false }) }} overlayStyle={{ width: "90%", height: "70%", justifyContent: "center", alignItems: "center" }}>
                    <View style={{ width: "100%", justifyContent: "center", alignItems: "center" }}>
                        <View>
                            <Text style={{ textAlignVertical: "center", fontWeight: "700", fontSize: 20 }}>{this.state.addMode ? "Add Meal" : "Edit Meal"}</Text>
                            <View style={styles.spaceSmall}></View>
                        </View>
                        <View>
                            <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>Name</Text>
                        </View>
                        <TextInput style={styles.input}
                            placeholder="e.g. Lunch, Dinner"
                            placeholderTextColor="#d9bebd"
                            onChangeText={(addNewName) => this.setState({ addNewName: addNewName })}
                            value={this.state.addNewName + ""} />
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                            <Button color={this.state.mode == "date" ? '#7ccfe6' : '#007AFF'} title="Select Date" onPress={() => { this.setState({ mode: "date" }) }} />
                            <Button color={this.state.mode == "time" ? '#7ccfe6' : '#007AFF'} title="Select Time" onPress={() => { this.setState({ mode: "time" }) }} />
                        </View>
                        <View>
                            <DateTimePicker
                                style={{ width: 320, backgroundColor: "white" }}
                                testID="dateTimePicker"
                                value={this.state.addNewDateTime}
                                mode={this.state.mode}
                                is24Hour={true}
                                display="default"
                                onChange={(event, newDate) => {
                                    this.setState({
                                        addNewDateTime: newDate
                                    })
                                }}
                            />
                        </View>
                        <View style={{ flexDirection: "row" }}>
                            {
                                this.state.addMode ?
                                    <TouchableOpacity style={styles.button} onPress={this.handleAddMeal}>
                                        <Text style={styles.insideButton}>Add Meal</Text>
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity style={styles.button} onPress={this.handleUpdateMeal}>
                                        <Text style={styles.insideButton}>Save Meal</Text>
                                    </TouchableOpacity>
                            }
                            <View style={{ width: "1%" }} />
                            <TouchableOpacity style={styles.button} onPress={() => {
                                this.setState({
                                    showAddModal: false
                                })
                            }}>
                                <Text style={styles.insideButton}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Overlay>
            </View>
        </>
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1
    },
    space: {
        width: 20,
        height: 20,
    },
    spaceSmall: {
        width: 20,
        height: 10,
    },
    cardText: {
        fontSize: 15,
    },
    bigText: {
        fontSize: 32,
        fontWeight: "700",
        marginBottom: 5
    },
    mb: {
        marginBottom: 15
    },
    button: {
        alignItems: "center",
        backgroundColor: "#5390d9",
        padding: 10,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    insideButton: {
        fontSize: 15,
        color: "white",
    },
    whiteText: {
        color: "white",
        fontSize: 15,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    input: {
        width: 200,
        padding: 10,
        margin: 5,
        height: 40,
        borderColor: '#c9392c',
        borderWidth: 1
    },
});

export default MealsView;