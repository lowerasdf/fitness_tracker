import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Alert, findNodeHandle, AccessibilityInfo, Keyboard } from 'react-native';
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
            accessibilityModalName: false,
            accessibilityModalDuration: false,
            accessibilityModalCalories: false,
            formHint: "",
            showingKeyboard: false
        }

        this.handleAddActivity = this.handleAddActivity.bind(this);
        this.addActivityModal = this.addActivityModal.bind(this);
        this.handleDeleteActivity = this.handleDeleteActivity.bind(this);
        this.deleteAlert = this.deleteAlert.bind(this);
        this.handleUpdateActivity = this.handleUpdateActivity.bind(this);
        this.updateTextInput = this.updateTextInput.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.modalNameFocus = React.createRef();
        this.modalDurationFocus = React.createRef();
        this.modalCaloriesFocus = React.createRef();
        this.startFocus = React.createRef();
        this.tabSub = null;
        this.moveSub = null;
        this._keyboardDidHide = this._keyboardDidHide.bind(this);
        this.onFocusHint = "Swipe right to access the keyboard. Once you’re done, you can make a two finger Z shaped gesture to exit the edit mode. To start or end dictation, double tap using two fingers";
        this.onFocusHintNumeric = "Please only enter numbers. Swipe right to access the keyboard. Once you’re done, you can make a two finger Z shaped gesture to exit the edit mode. To start or end dictation, double tap using two fingers";
        this._keyboardDidShow = this._keyboardDidShow.bind(this);
        this.escapeGestureHandler = this.escapeGestureHandler.bind(this);
        this.startFocusModal = React.createRef();
        this.dateTimeFocus = React.createRef();
    }

    _keyboardDidHide() {
        if (this.state.accessibilityModalName) {
            AccessibilityInfo.setAccessibilityFocus(findNodeHandle(this.modalNameFocus.current));
        } else if (this.state.accessibilityModalDuration) {
            AccessibilityInfo.setAccessibilityFocus(findNodeHandle(this.modalDurationFocus.current));
        } else if (this.state.accessibilityModalCalories) {
            AccessibilityInfo.setAccessibilityFocus(findNodeHandle(this.modalCaloriesFocus.current));
        }
        this.setState({
            accessibilityModalName: false,
            accessibilityModalDuration: false,
            accessibilityModalCalories: false,
            showingKeyboard: false,
            formHint: "",
        });
    }

    _keyboardDidShow() {
        this.setState({ showingKeyboard: true });
    }

    escapeGestureHandler() {
        if (this.state.showingKeyboard) {
            Keyboard.dismiss();
        } else if (this.state.showAddModal) {
            this.setState({
                showAddModal: false,
            })
            let reactTag = findNodeHandle(this.startFocus.current);
            if (reactTag) {
                AccessibilityInfo.setAccessibilityFocus(reactTag);
            }
        } else {
            this.props.logoutConfirmation();
        }
    }


    parseInput(input) {
        let retVal = parseFloat(input);
        if (isNaN(retVal)) {
            return 0
        }
        return retVal
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

        let reactTag = findNodeHandle(this.startFocus.current);
        if (reactTag) {
            AccessibilityInfo.setAccessibilityFocus(reactTag);
            AccessibilityInfo.setAccessibilityFocus(reactTag);
            AccessibilityInfo.setAccessibilityFocus(reactTag);
            AccessibilityInfo.setAccessibilityFocus(reactTag);
        }
        this.tabSub = this.props.navigation.addListener('tabPress', async e => {
            AccessibilityInfo.setAccessibilityFocus(findNodeHandle(this.startFocus.current));
        })
        this.moveSub = this.props.navigation.addListener('focus', async e => {
            AccessibilityInfo.setAccessibilityFocus(findNodeHandle(this.startFocus.current));
        })
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    }

    componentWillUnmount() {
        this.tabSub();
        this.moveSub();
        this.keyboardDidHideListener.remove();
        this.keyboardDidShowListener.remove();
    }

    addActivityModal() {
        return <>
            <View accessible={true} accessibilityViewIsModal={this.state.accessibilityModalName}>
                <Overlay
                    isVisible={this.state.showAddModal}
                    onBackdropPress={() => { this.setState({ showAddModal: false }) }}
                    overlayStyle={{ width: "90%", height: "70%", justifyContent: "center", alignItems: "center" }}
                    onShow={() => {
                        AccessibilityInfo.setAccessibilityFocus(findNodeHandle(this.startFocusModal.current));
                    }}
                >
                    <View style={{ width: "100%", justifyContent: "center", alignItems: "center" }}>
                        <View accessible={true}
                            onAccessibilityEscape={() => { this.setState({ showAddModal: false }) }}
                            ref={this.startFocusModal}
                            accessibilityHint="Fill out the name, the  duration, and the calories burned of the exercise below. Then, pick a date and time. You can keep the date and time untouched if date and time is now. If you want to cancel adding an exercise, make a two finger Z shaped gesture at any time or double tap on Cancel button at the very end"
                            accessibilityActions={[
                                { name: 'magicTap', label: 'magicTap' },
                                { name: 'escape', label: 'escape' }
                            ]}
                            onAccessibilityAction={(event) => {
                                switch (event.nativeEvent.actionName) {
                                    case 'magicTap':
                                        AccessibilityInfo.announceForAccessibility("If you want to jump to Profile view, first exit this modal by making a two finger Z shaped gesture ");
                                        break;
                                    case 'escape':
                                        this.escapeGestureHandler();
                                        break;
                                }
                            }}
                        >
                            <Text style={{ textAlignVertical: "center", fontWeight: "700", fontSize: 20 }}>{this.state.addMode ? "Add Exercise" : "Edit Exercise"}</Text>
                            <View style={styles.spaceSmall}></View>
                        </View>
                        <View accessible={true}
                            accessibilityActions={[
                                { name: 'magicTap', label: 'magicTap' },
                                { name: 'escape', label: 'escape' }
                            ]}
                            onAccessibilityAction={(event) => {
                                switch (event.nativeEvent.actionName) {
                                    case 'magicTap':
                                        AccessibilityInfo.announceForAccessibility("If you want to jump to Profile view, first exit this modal by making a two finger Z shaped gesture ");
                                        break;
                                    case 'escape':
                                        this.escapeGestureHandler();
                                        break;
                                }
                            }}>
                            <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>Name</Text>
                        </View>
                        <View accessibilityViewIsModal={this.state.accessibilityModalName}
                            onAccessibilityEscape={() => this.escapeGestureHandler()}
                            accessibilityActions={[
                                { name: 'magicTap', label: 'magicTap' },
                                { name: 'escape', label: 'escape' }
                            ]}
                            onAccessibilityAction={(event) => {
                                switch (event.nativeEvent.actionName) {
                                    case 'magicTap':
                                        AccessibilityInfo.announceForAccessibility("If you want to jump to Profile view, first exit this modal by making a two finger Z shaped gesture ");
                                        break;
                                    case 'escape':
                                        this.escapeGestureHandler();
                                        break;
                                }
                            }}
                        >
                            <TextInput style={styles.input}
                                placeholder="for example, jogging"
                                placeholderTextColor="#d9bebd"
                                onChangeText={(addNewName) => this.setState({ addNewName: addNewName })}
                                value={this.state.addNewName + ""}
                                accessibilityLabel="Enter the name of the exercise here!"
                                accessibilityHint={this.state.formHint}
                                ref={this.modalNameFocus}
                                onFocus={() => this.setState({
                                    accessibilityModalName: true,
                                    formHint: this.onFocusHint
                                })}
                            />
                        </View>
                        <View accessible={true}
                            accessibilityActions={[
                                { name: 'magicTap', label: 'magicTap' },
                                { name: 'escape', label: 'escape' }
                            ]}
                            onAccessibilityAction={(event) => {
                                switch (event.nativeEvent.actionName) {
                                    case 'magicTap':
                                        AccessibilityInfo.announceForAccessibility("If you want to jump to Profile view, first exit this modal by making a two finger Z shaped gesture ");
                                        break;
                                    case 'escape':
                                        this.escapeGestureHandler();
                                        break;
                                }
                            }}>
                            <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>Duration (mins)</Text>
                        </View>
                        <View accessibilityViewIsModal={this.state.accessibilityModalDuration}
                            accessibilityActions={[
                                { name: 'magicTap', label: 'magicTap' },
                                { name: 'escape', label: 'escape' }
                            ]}
                            onAccessibilityAction={(event) => {
                                switch (event.nativeEvent.actionName) {
                                    case 'magicTap':
                                        AccessibilityInfo.announceForAccessibility("If you want to jump to Profile view, first exit this modal by making a two finger Z shaped gesture ");
                                        break;
                                    case 'escape':
                                        this.escapeGestureHandler();
                                        break;
                                }
                            }}>
                            <TextInput style={styles.input}
                                keyboardType='numbers-and-punctuation'
                                placeholder="for example, 30"
                                placeholderTextColor="#d9bebd"
                                onChangeText={(addNewDuration) => this.setState({ addNewDuration: addNewDuration })}
                                value={this.state.addNewDuration + ""}
                                accessibilityLabel="Enter the duration of the exercise here!"
                                accessibilityHint={this.state.formHint}
                                ref={this.modalDurationFocus}
                                onFocus={() => this.setState({
                                    accessibilityModalDuration: true,
                                    formHint: this.onFocusHintNumeric
                                })}
                            />
                        </View>
                        <View accessible={true}
                            accessibilityActions={[
                                { name: 'magicTap', label: 'magicTap' },
                                { name: 'escape', label: 'escape' }
                            ]}
                            onAccessibilityAction={(event) => {
                                switch (event.nativeEvent.actionName) {
                                    case 'magicTap':
                                        AccessibilityInfo.announceForAccessibility("If you want to jump to Profile view, first exit this modal by making a two finger Z shaped gesture ");
                                        break;
                                    case 'escape':
                                        this.escapeGestureHandler();
                                        break;
                                }
                            }}>
                            <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>Calories (kcal)</Text>
                        </View>
                        <View accessibilityViewIsModal={this.state.accessibilityModalCalories}
                            accessibilityActions={[
                                { name: 'magicTap', label: 'magicTap' },
                                { name: 'escape', label: 'escape' }
                            ]}
                            onAccessibilityAction={(event) => {
                                switch (event.nativeEvent.actionName) {
                                    case 'magicTap':
                                        AccessibilityInfo.announceForAccessibility("If you want to jump to Profile view, first exit this modal by making a two finger Z shaped gesture ");
                                        break;
                                    case 'escape':
                                        this.escapeGestureHandler();
                                        break;
                                }
                            }}>
                            <TextInput style={styles.input}
                                keyboardType='numbers-and-punctuation'
                                placeholder="for example, 300"
                                placeholderTextColor="#d9bebd"
                                onChangeText={(addNewCal) => this.setState({ addNewCal: addNewCal })}
                                value={this.state.addNewCal + ""}
                                accessibilityLabel="Enter the calories burned during the exercise here!"
                                accessibilityHint={this.state.formHint}
                                ref={this.modalCaloriesFocus}
                                onFocus={() => this.setState({
                                    accessibilityModalCalories: true,
                                    formHint: this.onFocusHintNumeric
                                })}
                            />
                        </View>
                        <View ref={this.dateTimeFocus}
                            accessible={true}
                            accessibilityActions={[
                                { name: 'magicTap', label: 'magicTap' },
                                { name: 'escape', label: 'escape' }
                            ]}
                            onAccessibilityAction={(event) => {
                                switch (event.nativeEvent.actionName) {
                                    case 'magicTap':
                                        AccessibilityInfo.announceForAccessibility("If you want to jump to Profile view, first exit this modal by making a two finger Z shaped gesture ");
                                        break;
                                    case 'escape':
                                        this.escapeGestureHandler();
                                        break;
                                }
                            }}>
                            <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>Date & Time</Text>
                        </View>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                            <View accessibilityElementsHidden={this.state.mode === "date"}
                                accessibilityActions={[
                                    { name: 'magicTap', label: 'magicTap' },
                                    { name: 'escape', label: 'escape' }
                                ]}
                                onAccessibilityAction={(event) => {
                                    switch (event.nativeEvent.actionName) {
                                        case 'magicTap':
                                            AccessibilityInfo.announceForAccessibility("If you want to jump to Profile view, first exit this modal by making a two finger Z shaped gesture ");
                                            break;
                                        case 'escape':
                                            this.escapeGestureHandler();
                                            break;
                                    }
                                }}>
                                <TouchableOpacity
                                    accessibilityHint="you’re at the time mode. If you want to set up the date, double tap on this button."
                                    accessibilityRole="button"
                                    onPress={() => {
                                        this.setState({ mode: "date" })
                                        let reactTag = findNodeHandle(this.dateTimeFocus.current);
                                        if (reactTag) {
                                            AccessibilityInfo.setAccessibilityFocus(reactTag);
                                        }
                                    }}>
                                    <Text style={{ color: this.state.mode == "date" ? '#7ccfe6' : '#007AFF', fontSize: 18, paddingTop: 10, paddingHorizontal: 3 }}> Select Date</Text>
                                </TouchableOpacity>
                            </View>
                            <View accessibilityElementsHidden={this.state.mode === "time"}
                                accessibilityActions={[
                                    { name: 'magicTap', label: 'magicTap' },
                                    { name: 'escape', label: 'escape' }
                                ]}
                                onAccessibilityAction={(event) => {
                                    switch (event.nativeEvent.actionName) {
                                        case 'magicTap':
                                            AccessibilityInfo.announceForAccessibility("If you want to jump to Profile view, first exit this modal by making a two finger Z shaped gesture ");
                                            break;
                                        case 'escape':
                                            this.escapeGestureHandler();
                                            break;
                                    }
                                }}>
                                <TouchableOpacity
                                    accessibilityHint="you’re at the date mode. If you want to set up the time, double tap on this button."
                                    accessibilityRole="button"
                                    onPress={() => {
                                        this.setState({ mode: "time" })
                                        let reactTag = findNodeHandle(this.dateTimeFocus.current);
                                        if (reactTag) {
                                            AccessibilityInfo.setAccessibilityFocus(reactTag);
                                        }
                                    }}>
                                    <Text style={{ color: this.state.mode == "time" ? '#7ccfe6' : '#007AFF', fontSize: 18, paddingTop: 10, paddingHorizontal: 3 }}> Select Time</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View accessibilityActions={[
                            { name: 'magicTap', label: 'magicTap' },
                            { name: 'escape', label: 'escape' }
                        ]}
                            onAccessibilityAction={(event) => {
                                switch (event.nativeEvent.actionName) {
                                    case 'magicTap':
                                        AccessibilityInfo.announceForAccessibility("If you want to jump to Profile view, first exit this modal by making a two finger Z shaped gesture ");
                                        break;
                                    case 'escape':
                                        this.escapeGestureHandler();
                                        break;
                                }
                            }}>
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
                                    <TouchableOpacity style={styles.button} onPress={this.handleAddActivity}
                                        accessibilityRole="button"
                                        accessibilityHint="double tap to add activity"
                                        accessibilityActions={[
                                            { name: 'magicTap', label: 'magicTap' },
                                            { name: 'escape', label: 'escape' }
                                        ]}
                                        onAccessibilityAction={(event) => {
                                            switch (event.nativeEvent.actionName) {
                                                case 'magicTap':
                                                    AccessibilityInfo.announceForAccessibility("If you want to jump to Profile view, first exit this modal by making a two finger Z shaped gesture ");
                                                    break;
                                                case 'escape':
                                                    this.escapeGestureHandler();
                                                    break;
                                            }
                                        }}
                                    >
                                        <Text style={styles.insideButton}>Add Exercise</Text>
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity style={styles.button} onPress={this.handleUpdateActivity}
                                        accessibilityHint="double tap to update activity"
                                        accessibilityRole="button"
                                        accessibilityActions={[
                                            { name: 'magicTap', label: 'magicTap' },
                                            { name: 'escape', label: 'escape' }
                                        ]}
                                        onAccessibilityAction={(event) => {
                                            switch (event.nativeEvent.actionName) {
                                                case 'magicTap':
                                                    AccessibilityInfo.announceForAccessibility("If you want to jump to Profile view, first exit this modal by making a two finger Z shaped gesture ");
                                                    break;
                                                case 'escape':
                                                    this.escapeGestureHandler();
                                                    break;
                                            }
                                        }}
                                    >
                                        <Text style={styles.insideButton}>Save Exercise</Text>
                                    </TouchableOpacity>
                            }
                            <View style={{ width: "1%" }} />
                            <TouchableOpacity style={styles.button} onPress={() => {
                                this.setState({
                                    showAddModal: false
                                })
                                AccessibilityInfo.setAccessibilityFocus(findNodeHandle(this.startFocus.current));
                            }}
                                accessibilityHint="double tap to cancel adding an exercise"
                                accessibilityRole="button"
                                accessibilityActions={[
                                    { name: 'magicTap', label: 'magicTap' },
                                    { name: 'escape', label: 'escape' }
                                ]}
                                onAccessibilityAction={(event) => {
                                    switch (event.nativeEvent.actionName) {
                                        case 'magicTap':
                                            AccessibilityInfo.announceForAccessibility("If you want to jump to Profile view, first exit this modal by making a two finger Z shaped gesture ");
                                            break;
                                        case 'escape':
                                            this.escapeGestureHandler();
                                            break;
                                    }
                                }}>
                                <Text style={styles.insideButton}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Overlay>
            </View>
        </>
    }


    render() {
        return <>
            <ScrollView style={styles.mainContainer} contentContainerStyle={{ flexGrow: 11, justifyContent: 'center', alignItems: "center" }}>
                {this.addActivityModal()}
                <View style={{ justifyContent: "center", alignItems: "center" }}
                    accessible={true}
                    accessibilityLabel="You’re at the Exercises View. Let's get to work!"
                    accessibilityHint="Record your exercises below. To jump over to Profile's view, double tap with two fingers. To logout, make a two finger Z shaped gesture."
                    accessibilityActions={[
                        { name: 'magicTap', label: 'magicTap' },
                        { name: 'escape', label: 'escape' }
                    ]}
                    onAccessibilityAction={(event) => {
                        switch (event.nativeEvent.actionName) {
                            case 'magicTap':
                                this.props.navigation.navigate("Profile");
                                AccessibilityInfo.announceForAccessibility("Jump to: Profile View");
                                break;
                            case 'escape':
                                this.escapeGestureHandler();
                                break;
                        }
                    }}
                    ref={this.startFocus}>
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
                </View>
                <View style={styles.space} />
                <View accessible={true}
                    accessibilityLabel="Add Exercise"
                    accessibilityHint="double tap to add a new exercise"
                    accessibilityRole="button"
                    accessibilityActions={[
                        { name: 'magicTap', label: 'magicTap' },
                        { name: 'escape', label: 'escape' }
                    ]}
                    onAccessibilityAction={(event) => {
                        switch (event.nativeEvent.actionName) {
                            case 'magicTap':
                                this.props.navigation.navigate("Profile");
                                AccessibilityInfo.announceForAccessibility("Jump to: Profile View");
                                break;
                            case 'escape':
                                this.escapeGestureHandler();
                                break;
                        }
                    }} >

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => {
                            this.setState({ showAddModal: true, addMode: true })
                        }}
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
                                        <View accessible={true}
                                            accessibilityActions={[
                                                { name: 'magicTap', label: 'magicTap' },
                                                { name: 'escape', label: 'escape' }
                                            ]}
                                            onAccessibilityAction={(event) => {
                                                switch (event.nativeEvent.actionName) {
                                                    case 'magicTap':
                                                        this.props.navigation.navigate("Profile");
                                                        AccessibilityInfo.announceForAccessibility("Jump to: Profile View");
                                                        break;
                                                    case 'escape':
                                                        this.escapeGestureHandler();
                                                        break;
                                                }
                                            }}
                                        >
                                            <Text style={{ textAlignVertical: "center", fontWeight: "700", fontSize: 20 }}>{item["name"]}</Text>
                                        </View>
                                        <View style={{ flex: "1" }}></View>
                                        <TouchableOpacity onPress={() => this.updateTextInput(item["id"])}
                                            accessible={true}
                                            accessibilityLabel={"Modify " + item["name"]}
                                            accessibilityHint={"double tap to modify" + item["name"]}
                                            accessibilityRole="button"
                                            accessibilityActions={[
                                                { name: 'magicTap', label: 'magicTap' },
                                                { name: 'escape', label: 'escape' }
                                            ]}
                                            onAccessibilityAction={(event) => {
                                                switch (event.nativeEvent.actionName) {
                                                    case 'magicTap':
                                                        this.props.navigation.navigate("Profile");
                                                        AccessibilityInfo.announceForAccessibility("Jump to: Profile View");
                                                        break;
                                                    case 'escape':
                                                        this.escapeGestureHandler();
                                                        break;
                                                }
                                            }} >
                                            <Icon
                                                name='ios-create'
                                                type='ionicon'
                                                color='black'
                                                size={28}
                                            />
                                        </TouchableOpacity>
                                        <View style={{ flex: "0.08" }}></View>
                                        <TouchableOpacity onPress={() => this.deleteAlert(item["id"], item["name"])}
                                            accessible={true}
                                            accessibilityLabel={"Delete " + item["name"]}
                                            accessibilityHint={"double tap to delete" + item["name"]}
                                            accessibilityRole="button"
                                            accessibilityActions={[
                                                { name: 'magicTap', label: 'magicTap' },
                                                { name: 'escape', label: 'escape' }
                                            ]}
                                            onAccessibilityAction={(event) => {
                                                switch (event.nativeEvent.actionName) {
                                                    case 'magicTap':
                                                        this.props.navigation.navigate("Profile");
                                                        AccessibilityInfo.announceForAccessibility("Jump to: Profile View");
                                                        break;
                                                    case 'escape':
                                                        this.escapeGestureHandler();
                                                        break;
                                                }
                                            }}>
                                            <Icon
                                                name='ios-trash'
                                                type='ionicon'
                                                color='black'
                                                size={30}
                                            />
                                        </TouchableOpacity>
                                    </Body>
                                </CardItem>
                                <CardItem accessible={true}
                                    accessibilityLabel={item["name"] + "'s details: " + "Date, " + (new Date(item["date"])).toString().slice(0, -15) + "." + item["calories"] + " kilo calories burned, in " + item["duration"] + " minutes"}
                                    accessibilityActions={[
                                        { name: 'magicTap', label: 'magicTap' },
                                        { name: 'escape', label: 'escape' }
                                    ]}
                                    onAccessibilityAction={(event) => {
                                        switch (event.nativeEvent.actionName) {
                                            case 'magicTap':
                                                this.props.navigation.navigate("Profile");
                                                AccessibilityInfo.announceForAccessibility("Jump to: Profile View");
                                                break;
                                            case 'escape':
                                                this.escapeGestureHandler();
                                                break;
                                        }
                                    }}
                                >
                                    <Body>
                                        <Text style={styles.cardText}>Date: {(new Date(item["date"])).toString().slice(0, -15)}</Text>
                                        <Text style={styles.cardText}>Calories: {item["calories"]} kcal</Text>
                                        <Text style={styles.cardText}>Duration: {item["duration"]} mins</Text>
                                    </Body>
                                </CardItem>
                            </Card>
                        ))
                            :
                            <View style={{ width: "100%" }}
                                accessible={true}
                                accessibilityLabel="You don't have any exercise! Start adding exercise by double tapping on the Add Exercise button"
                                accessibilityActions={[
                                    { name: 'magicTap', label: 'magicTap' },
                                    { name: 'escape', label: 'escape' }
                                ]}
                                onAccessibilityAction={(event) => {
                                    switch (event.nativeEvent.actionName) {
                                        case 'magicTap':
                                            this.props.navigation.navigate("Profile");
                                            AccessibilityInfo.announceForAccessibility("Jump to: Profile View");
                                            break;
                                        case 'escape':
                                            this.escapeGestureHandler();
                                            break;
                                    }
                                }}
                            >
                                <Text style={{ fontStyle: "italic", textAlign: "center" }}>You don't have any exercise!</Text>
                                <Text style={{ fontStyle: "italic", textAlign: "center" }}>Start adding exercise by clicking the "Add Exercises" button above.</Text>
                            </View>
                    }
                </View>
            </ScrollView>
        </>
    }

    deleteAlert(id, name) {
        Alert.alert(
            'Delete ' + name + '?',
            'Once deleted, this action cannot be reverted',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                    onPress: () => {
                        let reactTag = findNodeHandle(this.startFocus.current);
                        if (reactTag) {
                            AccessibilityInfo.setAccessibilityFocus(reactTag);
                        }
                    }
                },
                {
                    text: 'Delete', onPress: () => {
                        this.handleDeleteActivity(id, name);
                        let reactTag = findNodeHandle(this.startFocus.current);
                        if (reactTag) {
                            AccessibilityInfo.setAccessibilityFocus(reactTag);
                        }
                    }
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
                                text: "OK", onPress: () => {
                                    this.setState({
                                        showAddModal: false,
                                    })
                                    AccessibilityInfo.setAccessibilityFocus(findNodeHandle(this.startFocus.current));
                                }
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

    handleAddActivity() {
        if (isNaN(parseFloat(this.state.addNewDuration)) && this.state.addNewDuration !== "") {
            Alert.alert(
                "Invalid Entry",
                "Make sure that you only entered numbers in the duration of the exercise. Press ok below to continue.",
                [
                    {
                        text: "OK", onPress: () => {
                            let reactTag = findNodeHandle(this.modalDurationFocus.current);
                            if (reactTag) {
                                AccessibilityInfo.setAccessibilityFocus(reactTag);
                            }
                        }
                    }
                ],
                { cancelable: false }
            );
            return;
        }
        if (isNaN(parseFloat(this.state.addNewCal)) && this.state.addNewCal !== "") {
            Alert.alert(
                "Invalid Entry",
                "Make sure that you only entered numbers in the calories burned during the exercise. Press ok below to continue.",
                [
                    {
                        text: "OK", onPress: () => {
                            let reactTag = findNodeHandle(this.modalCaloriesFocus.current);
                            if (reactTag) {
                                AccessibilityInfo.setAccessibilityFocus(reactTag);
                            }
                        }
                    }
                ],
                { cancelable: false }
            );
            return;
        }
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
                        (this.state.addNewName === "" ? "New Activity" : this.state.addNewName) + " has been created. Press ok below to continue.",
                        [
                            {
                                text: "OK", onPress: () => {
                                    this.setState({
                                        showAddModal: false,
                                        addNewCal: "",
                                        addNewName: "",
                                        addNewDuration: "",
                                        addNewDateTime: new Date(),
                                        mode: "date",
                                    })
                                    AccessibilityInfo.setAccessibilityFocus(findNodeHandle(this.startFocus.current));
                                }
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
            })
            .catch(err => {
                alert("Something went wrong! Verify you have filled out the fields correctly.");
            });
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