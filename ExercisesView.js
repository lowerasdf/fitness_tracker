import React from 'react';
import { StyleSheet, Text, View, Button, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Card, CardItem, Body } from 'native-base'
import { Overlay } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Icon } from 'react-native-elements';

class ExercisesView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activityList: [],
            showAddModal: false,
            addNewCal: "",
            addNewName: "",
            addNewDuration: "",
            addNewDateTime: new Date(),
            mode: "date",
            addMode: true,
            editID: "",
        }

        this.handleAddActivity = this.handleAddActivity.bind(this);
        this.addActivityModal = this.addActivityModal.bind(this);
        this.handleDeleteActivity = this.handleDeleteActivity.bind(this);
        this.deleteAlert = this.deleteAlert.bind(this);
        this.handleUpdateActivity = this.handleUpdateActivity.bind(this);
        this.updateTextInput = this.updateTextInput.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    parseInput(input) {
        let retVal = parseFloat(input);
        if (isNaN(retVal)) {
            return 0
        }
        return retVal
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
                    text: 'Delete', onPress: () => this.handleDeleteActivity(id, name)
                }
            ],
            { cancelable: false }
        );
    }

    updateTextInput(id) {
        for (let i = 0; i < this.state.activityList.length; i++) {
            if (this.state.activityList[i]["id"] === id) {
                this.setState({
                    addNewCal: this.state.activityList[i]["calories"],
                    addNewDateTime: new Date(this.state.activityList[i]["date"]),
                    addNewDuration: this.state.activityList[i]["duration"],
                    addNewName: this.state.activityList[i]["name"],
                })
                break;
            }
        }
        this.setState({ showAddModal: true, addMode: false, editID: id });
    }

    handleUpdateActivity() {
        fetch('https://mysqlcs639.cs.wisc.edu/activities/' + this.state.editID, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': this.props.accessToken
            },
            body: JSON.stringify({
                calories: this.parseInput(this.state.addNewCal),
                date: this.state.addNewDateTime,
                duration: this.parseInput(this.state.addNewDuration),
                name: this.state.addNewName === "" ? "New Activity" : this.state.addNewName,
            })
        })
            .then(res => res.json())
            .then(res => {
                if (res.message === "Activity updated!") {
                    let updatedList = JSON.parse(JSON.stringify(this.state.activityList));
                    let oldName = "";
                    for (var i = updatedList.length - 1; i >= 0; i--) {
                        if (updatedList[i]["id"] === this.state.editID) {
                            updatedList[i]["calories"] = this.parseInput(this.state.addNewCal);
                            updatedList[i]["date"] = this.state.addNewDateTime;
                            updatedList[i]["duration"] = this.parseInput(this.state.addNewDuration);
                            oldName = updatedList[i]["name"];
                            updatedList[i]["name"] = this.state.addNewName === "" ? "New Activity" : this.state.addNewName;
                            break;
                        }
                    }
                    this.setState({
                        activityList: updatedList
                    });
                    this.props.updateActivityList(this.state.activityList);
                    Alert.alert(
                        "Activity updated!",
                        oldName + " has been updated.",
                        [
                            {
                                text: "OK", onPress: () => this.setState({
                                    showAddModal: false,
                                    addNewCal: "",
                                    addNewName: "",
                                    addNewDuration: "",
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

    handleDeleteActivity(id, name) {
        fetch('https://mysqlcs639.cs.wisc.edu/activities/' + id, {
            method: 'DELETE',
            headers: {
                'x-access-token': this.props.accessToken
            }
        })
            .then(res => res.json())
            .then(res => {
                if (res.message === "Activity deleted!") {
                    let updatedList = JSON.parse(JSON.stringify(this.state.activityList));
                    for (var i = updatedList.length - 1; i >= 0; i--) {
                        if (updatedList[i]["id"] === id) {
                            updatedList.splice(i, 1);
                            break;
                        }
                    }
                    this.setState({
                        activityList: updatedList
                    });
                    this.props.updateActivityList(this.state.activityList);
                    Alert.alert(
                        "Activity deleted!",
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

    addActivityModal() {
        return <>
            <View>
                <Overlay isVisible={this.state.showAddModal} onBackdropPress={() => { this.setState({ showAddModal: false }) }} overlayStyle={{ width: "90%", height: "70%", justifyContent: "center", alignItems: "center" }}>
                    <View style={{ width: "100%", justifyContent: "center", alignItems: "center" }}>
                        <View>
                            <Text style={{ textAlignVertical: "center", fontWeight: "700", fontSize: 20 }}>{this.state.addMode ? "Add Exercise" : "Edit Exercise"}</Text>
                            <View style={styles.spaceSmall}></View>
                        </View>
                        <View>
                            <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>Name</Text>
                        </View>
                        <TextInput style={styles.input}
                            placeholder="e.g. jogging"
                            placeholderTextColor="#d9bebd"
                            onChangeText={(addNewName) => this.setState({ addNewName: addNewName })}
                            value={this.state.addNewName + ""} />
                        <View>
                            <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>Duration (mins)</Text>
                        </View>
                        <TextInput style={styles.input}
                            keyboardType='decimal-pad'
                            placeholder="e.g. 30"
                            placeholderTextColor="#d9bebd"
                            onChangeText={(addNewDuration) => this.setState({ addNewDuration: addNewDuration })}
                            value={this.state.addNewDuration + ""} />
                        <View>
                            <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>Calories (kcal)</Text>
                        </View>
                        <TextInput style={styles.input}
                            keyboardType='decimal-pad'
                            placeholder="e.g. 300"
                            placeholderTextColor="#d9bebd"
                            onChangeText={(addNewCal) => this.setState({ addNewCal: addNewCal })}
                            value={this.state.addNewCal + ""} />
                        <View>
                            <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>Date & Time</Text>
                        </View>
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
                                    <TouchableOpacity style={styles.button} onPress={this.handleAddActivity}>
                                        <Text style={styles.insideButton}>Add Exercise</Text>
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity style={styles.button} onPress={this.handleUpdateActivity}>
                                        <Text style={styles.insideButton}>Save Exercise</Text>
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

    handleAddActivity() {
        fetch('https://mysqlcs639.cs.wisc.edu/activities', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': this.props.accessToken
            },
            body: JSON.stringify({
                calories: this.parseInput(this.state.addNewCal),
                date: this.state.addNewDateTime,
                duration: this.parseInput(this.state.addNewDuration),
                name: this.state.addNewName === "" ? "New Activity" : this.state.addNewName,
            })
        })
            .then(res => res.json())
            .then(res => {
                if (res.message === "Activity created!") {
                    this.setState(prevState => ({
                        activityList: [...prevState.activityList, {
                            id: res.id,
                            calories: this.parseInput(this.state.addNewCal),
                            date: this.state.addNewDateTime,
                            duration: this.parseInput(this.state.addNewDuration),
                            name: this.state.addNewName === "" ? "New Activity" : this.state.addNewName,
                        }]
                    }))
                    this.props.updateActivityList(this.state.activityList);
                    Alert.alert(
                        "Activity created!",
                        (this.state.addNewName === "" ? "New Activity" : this.state.addNewName) + " has been created.",
                        [
                            {
                                text: "OK", onPress: () => this.setState({
                                    showAddModal: false,
                                    addNewCal: "",
                                    addNewName: "",
                                    addNewDuration: "",
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

    componentDidMount() {
        fetch('https://mysqlcs639.cs.wisc.edu/activities/', {
            method: 'GET',
            headers: { 'x-access-token': this.props.accessToken }
        })
            .then(res => res.json())
            .then(res => {
                this.setState({
                    activityList: res["activities"]
                });
                this.props.updateActivityList(this.state.activityList);
            });
    }

    render() {
        return <>
            <ScrollView style={styles.mainContainer} contentContainerStyle={{ flexGrow: 11, justifyContent: 'center', alignItems: "center" }}>
                {this.addActivityModal()}
                <View style={styles.space} />
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    <Icon name="running" type='font-awesome-5' size={45} color="#5e60ce" style={{ marginRight: 5 }} />
                    <Text style={styles.bigText}>Exercises</Text>
                </View>
                <View>
                    <Text>Let's get to work!</Text>
                </View>
                <View>
                    <Text>Record your exercises below.</Text>
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
                        <Text style={styles.whiteText}>Add Exercise</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.space} />
                <View style={{ width: "90%" }}>
                    {
                        this.state.activityList.length !== 0 ? this.state.activityList.map((item, key) => (
                            <Card key={key}>
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
                                <CardItem>
                                    <Body>
                                        <Text style={styles.cardText}>Date: {(new Date(item["date"])).toString().slice(0, -15)}</Text>
                                        <Text style={styles.cardText}>Calories: {item["calories"]} kcal</Text>
                                        <Text style={styles.cardText}>Duration: {item["duration"]} mins</Text>
                                    </Body>
                                </CardItem>
                            </Card>
                        ))
                            :
                            <View style={{ width: "100%" }}>
                                <Text style={{ fontStyle: "italic", textAlign: "center" }}>You don't have any exercise!</Text>
                                <Text style={{ fontStyle: "italic", textAlign: "center" }}>Start adding exercise by clicking the "Add Exercises" button above.</Text>
                            </View>
                    }
                </View>
            </ScrollView>
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

export default ExercisesView;