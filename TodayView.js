import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, ScrollView } from 'react-native';
import { Card, CardItem, Body, List, ListItem } from 'native-base';
import { Icon, Slider } from 'react-native-elements';

class TodayView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }

    }

    componentDidMount() {

    }

    render() {
        return <>
            <ScrollView style={styles.mainContainer} contentContainerStyle={{ flexGrow: 11, justifyContent: 'center', alignItems: "center" }}>
                <View style={styles.space} />
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
                <View style={styles.space} />
                <View>
                    <Text style={{ textAlignVertical: "center", fontWeight: "700", fontSize: 20, marginBottom: 10 }}>Goals Status</Text>
                </View>
                <View>
                    <Text>
                        Overall Calories: {this.props.totalCals} - {this.props.totalCalsBurned} = {this.props.totalCals - this.props.totalCalsBurned} kcal
                    </Text>
                </View>
                <View style={{ alignItems: 'stretch', justifyContent: 'center' }}>
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
                <View style={{ alignItems: 'stretch', justifyContent: 'center', marginBottom: 0 }}>
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
                <View style={{ flexDirection: "column", flexWrap: "wrap", width: "50%", justifyContent: "center", marginTop: 10 }}>
                    <Text>· Carbs: {this.props.totalCarbs}/{this.props.goalDailyCarbohydrates} gr</Text>
                </View>
                <View style={{ flexDirection: "column", flexWrap: "wrap", width: "50%", justifyContent: "center", marginTop: 0, }}>
                    <Text>· Protein: {this.props.totalProtein}/{this.props.goalDailyProtein} gr</Text>
                </View>
                <View style={{ flexDirection: "column", flexWrap: "wrap", width: "50%", justifyContent: "center", marginTop: 0 }}>
                    <Text>· Fat: {this.props.totalFat}/{this.props.goalDailyFat} gr</Text>
                </View>
                <View style={styles.space} />
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    <Icon name="running" type='font-awesome-5' size={35} color="#5e60ce" style={{ marginRight: 5 }} />
                    <Text style={styles.headerText}>Exercises</Text>
                </View>
                <View style={{ width: "90%", justifyContent: "center", alignItems: "center" }}>
                    {
                        this.props.todayActivityList.length != 0 ? this.props.todayActivityList.map((item, key) => (
                            <Card key={key} style={{ width: "90%" }}>
                                <CardItem bordered>
                                    <Body style={{ flexDirection: "row" }}>
                                        <Text style={{ textAlignVertical: "center", fontWeight: "700", fontSize: 20 }}>{item["name"]}</Text>
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
                            <View style={{ width: "90%" }}>
                                <Text style={{ fontStyle: "italic", textAlign: "center" }}>You don't have any exercise today!</Text>
                                <Text style={{ fontStyle: "italic", textAlign: "center" }}>Start adding exercise by clicking the Exercises tab below.</Text>
                            </View>
                    }
                </View>

                <View style={styles.space} />
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    <Icon name="ios-restaurant" type='ionicon' size={35} color="#5e60ce" style={{ marginRight: 10 }} />
                    <Text style={styles.headerText}>Meals</Text>
                </View>
                <View style={{ width: "90%", justifyContent: "center", alignItems: "center" }}>
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
                                                                    <Text style={{fontSize: 14, fontWeight: "600"}}>{food["name"]} </Text>
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