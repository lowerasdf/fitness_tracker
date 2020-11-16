import React from 'react';
import { StyleSheet, Text, View, ScrollView, AccessibilityInfo, findNodeHandle } from 'react-native';
import { Card, CardItem, Body, List, ListItem } from 'native-base';
import { Icon, Slider } from 'react-native-elements';

class TodayView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            header: "You’re at the Today View. What's on the agenda for today?"
        }
        this.startFocus = React.createRef();
        this.componentDidMount = this.componentDidMount.bind(this);
        this.tabSub = null;
        this.moveSub = null;
    }

    componentDidMount() {
        let reactTag = findNodeHandle(this.startFocus.current);
        if(reactTag) {
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
    }

    componentWillUnmount() {
        this.tabSub();
        this.moveSub();
    }

    render() {
        return <>
            <ScrollView style={styles.mainContainer} contentContainerStyle={{ flexGrow: 11, justifyContent: 'center', alignItems: "center" }}>
                <View style={styles.space} />
                <View style={{ justifyContent: "center", alignItems: "center" }}
                    accessible={true}
                    accessibilityLabel={this.state.header}
                    accessibilityHint="Below are all of your goals and exercises. To jump over to the Exercises view, double tap with two fingers. To logout, make a two finger Z shaped gesture."
                    accessibilityActions={[
                        { name: 'magicTap', label: 'magicTap' },
                        { name: 'escape', label: 'escape' }
                    ]}
                    onAccessibilityAction={(event) => {
                        switch (event.nativeEvent.actionName) {
                            case 'magicTap':
                                this.props.navigation.navigate("Exercises");
                                AccessibilityInfo.announceForAccessibility("Jump to: Exercises View");
                                break;
                            case 'escape':
                                this.props.logoutConfirmation();
                                break;
                        }
                    }}
                    ref={this.startFocus}>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        <Icon name="ios-sunny" type='ionicon' size={45} color="#5e60ce" style={{ marginRight: 5 }} />
                        <Text style={styles.bigText}>Today</Text>
                    </View>
                    <View>
                        <Text>What's on the agenda for today?</Text>
                    </View>
                    <View>
                        <Text>Below are all of your goals and exercises.</Text>
                    </View>
                </View>

                <View style={styles.space} />
                <View style={{ justifyContent: "center", alignItems: "center" }}
                    accessible={true}
                    accessibilityLabel={"Goals Status. You have exercised for " + this.props.totalMins + " minutes today. Your goal for today is " + this.props.goalDailyActivity + " minutes."}
                    accessibilityActions={[
                        { name: 'magicTap', label: 'magicTap' },
                        { name: 'escape', label: 'escape' }
                    ]}
                    onAccessibilityAction={(event) => {
                        switch (event.nativeEvent.actionName) {
                            case 'magicTap':
                                this.props.navigation.navigate("Exercises");
                                AccessibilityInfo.announceForAccessibility("Jump to: Exercises View");
                                break;
                            case 'escape':
                                this.props.logoutConfirmation();
                                break;
                        }
                    }}
                >
                    <View>
                        <Text style={{ textAlignVertical: "center", fontWeight: "700", fontSize: 20, marginBottom: 10 }}>Goals Status</Text>
                    </View>
                    <View accessible={false}>
                        <Text>
                            Overall Calories: {this.props.totalCals} - {this.props.totalCalsBurned} = {this.props.totalCals - this.props.totalCalsBurned} kcal
                    </Text>
                    </View>
                    <View style={{ alignItems: 'stretch', justifyContent: 'center' }} accessible={false}>
                        <Slider
                            value={this.props.totalMins}
                            maximumValue={this.props.goalDailyActivity}
                            minimumValue={0}
                            disabled
                            thumbStyle={{ height: 1, width: 1, backgroundColor: 'transparent' }}
                            minimumTrackTintColor="#5e60ce"
                            maximumTrackTintColor="#b8d2fc"
                        />
                        <Text>Daily Activity: {this.props.totalMins}/{this.props.goalDailyActivity} minutes</Text>
                    </View>
                    <View style={{ alignItems: 'stretch', justifyContent: 'center', marginBottom: 0 }} accessible={false}>
                        <Slider
                            value={this.props.totalCals}
                            maximumValue={this.props.goalDailyCalories}
                            minimumValue={0}
                            disabled
                            thumbStyle={{ height: 1, width: 1, backgroundColor: 'transparent' }}
                            minimumTrackTintColor="#5e60ce"
                            maximumTrackTintColor="#b8d2fc"
                        />
                        <Text>Daily Meals: {this.props.totalCals}/{this.props.goalDailyCalories} kcal</Text>
                    </View>
                    <View style={{ flexDirection: "column", flexWrap: "wrap", width: "50%", justifyContent: "center", marginTop: 10 }} accessible={false}>
                        <Text>· Carbs: {this.props.totalCarbs}/{this.props.goalDailyCarbohydrates} gr</Text>
                    </View>
                    <View style={{ flexDirection: "column", flexWrap: "wrap", width: "50%", justifyContent: "center", marginTop: 0, }} accessible={false}>
                        <Text>· Protein: {this.props.totalProtein}/{this.props.goalDailyProtein} gr</Text>
                    </View>
                    <View style={{ flexDirection: "column", flexWrap: "wrap", width: "50%", justifyContent: "center", marginTop: 0 }} accessible={false}>
                        <Text>· Fat: {this.props.totalFat}/{this.props.goalDailyFat} gr</Text>
                    </View>
                </View>
                <View style={styles.space} />
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}
                    accessible={true}
                    accessibilityLabel="Exercises"
                    accessibilityHint="Below are all of your today's exercises"
                    accessibilityActions={[
                        { name: 'magicTap', label: 'magicTap' },
                        { name: 'escape', label: 'escape' }
                    ]}
                    onAccessibilityAction={(event) => {
                        switch (event.nativeEvent.actionName) {
                            case 'magicTap':
                                this.props.navigation.navigate("Exercises");
                                AccessibilityInfo.announceForAccessibility("Jump to: Exercises View");
                                break;
                            case 'escape':
                                this.props.logoutConfirmation();
                                break;
                        }
                    }}
                >
                    <Icon name="running" type='font-awesome-5' size={35} color="#5e60ce" style={{ marginRight: 5 }} />
                    <Text style={styles.headerText}>Exercises</Text>
                </View>
                <View style={{ width: "90%", justifyContent: "center", alignItems: "center" }}>
                    {
                        this.props.todayActivityList.length != 0 ? this.props.todayActivityList.map((item, key) => (
                            <Card key={key} style={{ width: "90%" }}>
                                <CardItem bordered
                                    accessible={true}
                                    accessibilityLabel={item["name"]}
                                    accessibilityHint="Edit this exercise on the exercises view"
                                    accessibilityActions={[
                                        { name: 'magicTap', label: 'magicTap' },
                                        { name: 'escape', label: 'escape' }
                                    ]}
                                    onAccessibilityAction={(event) => {
                                        switch (event.nativeEvent.actionName) {
                                            case 'magicTap':
                                                this.props.navigation.navigate("Exercises");
                                                AccessibilityInfo.announceForAccessibility("Jump to: Exercises View");
                                                break;
                                            case 'escape':
                                                this.props.logoutConfirmation();
                                                break;
                                        }
                                    }}
                                >
                                    <Body style={{ flexDirection: "row" }}>
                                        <Text style={{ textAlignVertical: "center", fontWeight: "700", fontSize: 20 }}>{item["name"]}</Text>
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
                                                this.props.navigation.navigate("Exercises");
                                                AccessibilityInfo.announceForAccessibility("Jump to: Exercises View");
                                                break;
                                            case 'escape':
                                                this.props.logoutConfirmation();
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
                            <View style={{ width: "90%" }}
                                accessible={true}
                                accessibilityLabel="You don't have any exercise today! Start adding exercise by double tapping using two fingers to get into the Exercises View"
                                accessibilityActions={[
                                    { name: 'magicTap', label: 'magicTap' },
                                    { name: 'escape', label: 'escape' }
                                ]}
                                onAccessibilityAction={(event) => {
                                    switch (event.nativeEvent.actionName) {
                                        case 'magicTap':
                                            this.props.navigation.navigate("Exercises");
                                            AccessibilityInfo.announceForAccessibility("Jump to: Exercises View");
                                            break;
                                        case 'escape':
                                            this.props.logoutConfirmation();
                                            break;
                                    }
                                }}
                            >
                                <Text style={{ fontStyle: "italic", textAlign: "center" }}>You don't have any exercise today!</Text>
                                <Text style={{ fontStyle: "italic", textAlign: "center" }}>Start adding exercise by clicking the Exercises tab below.</Text>
                            </View>
                    }
                </View>
                <View style={styles.space} />
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }} accessibilityElementsHidden={true}>
                    <Icon name="ios-restaurant" type='ionicon' size={35} color="#5e60ce" style={{ marginRight: 10 }} />
                    <Text style={styles.headerText}>Meals</Text>
                </View>
                <View style={{ width: "90%", justifyContent: "center", alignItems: "center" }} accessibilityElementsHidden={true}>
                    {
                        this.props.todayMealList.length != 0 ? this.props.todayMealList.map((item, key) => (
                            <Card key={key} style={{ width: "90%" }}>
                                <CardItem bordered>
                                    <Body style={{ flexDirection: "column" }}>
                                        <Text style={{ textAlignVertical: "center", fontWeight: "700", fontSize: 20 }}>{item["name"]}</Text>
                                        <Text style={styles.cardText}>{item["carbs"]} gr Carbs, {item["protein"]} gr Protein, {item["fat"]} gr Fat</Text>
                                    </Body>
                                </CardItem>
                                <CardItem bordered>
                                    <Body>
                                        <Text style={styles.cardText}>Date: {(new Date(item["date"])).toString().slice(0, -15)}</Text>
                                        <Text style={styles.cardText}>Calories: {item["cals"]} kcal</Text>
                                    </Body>
                                </CardItem>
                                <CardItem>
                                    <Body>
                                        {

                                            item["foods"] !== undefined && item["foods"].length != 0 ?
                                                <List>
                                                    {
                                                        item["foods"].map((food, foodkey) => (
                                                            <ListItem key={foodkey}>
                                                                <Text>
                                                                    <Text style={{ fontSize: 14, fontWeight: "600" }}>{food["name"]} </Text>
                                                                    ({food["calories"]} kcal, {food["carbohydrates"]} gr Carbs, {food["protein"]} gr Protein, {food["fat"]} gr Fat)
                                                                    </Text>
                                                            </ListItem>
                                                        ))
                                                    }
                                                </List>
                                                :
                                                <View>
                                                    <Text style={{ fontStyle: "italic", textAlign: "center" }}>You don't have any food for this meal!</Text>
                                                    <Text style={{ fontStyle: "italic", textAlign: "center" }}>Start adding food by clicking the Meals tab below.</Text>
                                                </View>
                                        }
                                    </Body>
                                </CardItem>
                            </Card>
                        ))
                            :
                            <View style={{ width: "90%" }}>
                                <Text style={{ fontStyle: "italic", textAlign: "center" }}>You don't have any meal today!</Text>
                                <Text style={{ fontStyle: "italic", textAlign: "center" }}>Start adding meal by clicking the Meals tab below.</Text>
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
    bigText: {
        fontSize: 32,
        fontWeight: "700",
        marginBottom: 5
    },
    headerText: {
        fontSize: 28,
        fontWeight: "400",
        marginBottom: 5
    },
});

export default TodayView;