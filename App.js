// @flow
import React, { Component } from 'react'
import {
	Dimensions,
	FlatList,
	ScrollView,
	ActivityIndicator,
	Text,
	View,
	Image,
	Button,
	StyleSheet,
	ImageBackground,
	TouchableHighlight,
} from 'react-native'
import { autobind } from 'core-decorators'
import { orderBy } from 'lodash'
import { createStackNavigator } from 'react-navigation'
import SearchInput, { createFilter } from 'react-native-search-filter'
//  sudo sysctl -w fs.inotify.max_user_instances=1024
//  sudo sysctl -w fs.inotify.max_user_watches=12288
const KEYS_TO_FILTERS = 'title'
let star1 = {
	uri:
		'https://vignette.wikia.nocookie.net/starwars/images/7/75/EPI_TPM_poster.png/revision/latest?cb=20130822171446',
}
let star2 = {
	uri:
		'https://images-na.ssl-images-amazon.com/images/I/51BGV8AJ4RL._SY445_.jpg',
}
let star3 = {
	uri:
		'https://images-na.ssl-images-amazon.com/images/I/512K3DWTQ0L._SY445_.jpg',
}
let star4 = {
	uri:
		'https://images-na.ssl-images-amazon.com/images/I/81ae8A9aEYL._SL1500_.jpg',
}
let star5 = {
	uri:
		'https://images-na.ssl-images-amazon.com/images/I/91%2BCydthCeL._SY445_.jpg',
}
let star6 = {
	uri:
		'https://images-na.ssl-images-amazon.com/images/I/51ELRnj3VnL._SY445_.jpg',
}
var wars1 = [star1, star2, star3, star4, star5, star6]
var titleImage = {
	uri:
		'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT14lhcYRdbjRFOz-Xx22BcH48T6_nhW8Zz9e8Kl8wZ6alykM5WsA',
}
var pic = {
	uri:
		'https://thumbs.dreamstime.com/b/sparkle-stars-background-scrapbook-designs-46219357.jpg',
}
type Movie = {
	title: string,
	episode_number: string,
	main_characters: Array<string>,
	description: string,
	poster: string,
	hero_image: string,
}
class LogoTitle extends Component<{}, {}> {
	render() {
		return (
			<Image
				source={titleImage}
				style={{
					height: 56,
					resizeMode: 'stretch',
					width: Dimensions.get('screen').width,
				}}
			/>
		)
	}
}
class App extends Component<
	{ navigation: any },
	{ pressed: boolean, dataSource: Array<Movie>, searchTerm: string }
> {
	constructor() {
		super()

		this.state = {
			dataSource: [],
			pressed: true,
			searchTerm: '',
		}
	}

	async componentDidMount() {
		try {
			const response = await fetch(
				'https://raw.githubusercontent.com/RyanHemrick/star_wars_movie_app/master/movies.json'
			)
			const json = await response.json()
			this.setState(
				{
					dataSource: json.movies,
				},
				function() {}
			)
		} catch (e) {
			console.log('Chyba nahrání dat')
		}
	}
	searchUpdated(term) {
		this.setState({ searchTerm: term })
	}
	@autobind
	reorder() {
		console.log('pressed')
		if (this.state.pressed == true) {
			this.setState({
				pressed: !this.state.pressed,
			})
		} else {
			this.setState({
				pressed: !this.state.pressed,
			})
		}
		console.log(this.state.pressed)
	}
	@autobind
	getInfo(description) {
		console.log('coko')

		this.props.navigation.push('Ep', { desc: description })
	}
	static navigationOptions = {
		// headerTitle instead of title
		headerTitle: <LogoTitle />,
	}
	render() {
		const moviesAfter = this.state.dataSource.filter(
			createFilter(this.state.searchTerm, KEYS_TO_FILTERS)
		)
		return (
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<SearchInput
					onChangeText={term => {
						this.searchUpdated(term)
					}}
					style={styles.searchInput}
					placeholder="Type a message to search"
				/>
				<Image
					source={pic}
					style={{
						width: '100%',
						height: '100%',
						resizeMode: 'cover',
						position: 'absolute',
					}}
				/>
				<FlatList
					data={this.state.dataSource}
					renderItem={({ item, index }) => (
						<View>
							<Text style={styles.bigWhite}>
								{item.title}
								{'\n'}
								{item.episode_number}
								{'\n'}
							</Text>

							<TouchableHighlight
								onPress={() => this.getInfo(item.description)}
							>
								<Image
									source={wars1[parseInt(item.episode_number) - 1]}
									style={{
										width: Dimensions.get('screen').width,
										height: Dimensions.get('screen').height,
										resizeMode: 'stretch',
										justifyContent: 'center',
										alignItems: 'center',
									}}
								/>
							</TouchableHighlight>
						</View>
					)}
					keyExtractor={(item, index) => index.toString()}
					inverted={this.state.pressed}
				/>

				<Button
					onPress={this.reorder}
					title="Order"
					color="chocolate"
					accessibilityLabel="Learn more about this purple button"
				/>
			</View>
		)
	}
}

class Epzd extends Component<{ navigation: any }, {}> {
	static navigationOptions = {
		// headerTitle instead of title
		headerTitle: <LogoTitle />,
	}
	render() {
		const { navigation } = this.props
		const description = navigation.getParam('desc')

		return (
			<ScrollView>
				<View
					style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
				>
					<Image source={pic} style={styles.imageContainer} />
					<Text style={styles.epizod}>
						{description}
						//{this.props.navigation.state.params.desc}
					</Text>
					<Button
						title="Go HARD or GO HOME"
						color="chocolate"
						accessibilityLabel="Learn more about this purple button"
						onPress={() => {
							this.props.navigation.navigate('Home')
						}}
					/>
				</View>
			</ScrollView>
		)
	}
}

export default createStackNavigator(
	{
		Home: App,
		Ep: Epzd,
	},
	{
		initialRouteName: 'Home',
	}
)

const styles = StyleSheet.create({
	bigWhite: {
		color: 'white',
		fontWeight: 'bold',
		fontSize: 30,
		textAlign: 'center',
	},
	epizod: {
		color: 'gold',
		fontSize: 25,
		fontWeight: 'bold',
		textAlign: 'center',
	},
	flip: {
		transform: [{ scaleY: -1 }],
	},
	imageContainer: {
		width: '100%',
		height: '100%',
		resizeMode: 'cover',
		position: 'absolute',
	},
	image: {
		flex: 1,
	},
	searchInput: {
		padding: 10,
		borderColor: '#CCC',
		borderWidth: 1,
	},
})
