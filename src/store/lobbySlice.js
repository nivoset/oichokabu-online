import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { UserAPI, LobbyAPI } from '../services/api-functions.js';

export const fetchUserId = createAsyncThunk(
	"lobby/fetchUserId",
	async (_, thunkAPI) => {
		try {
			const response = await UserAPI.getUserId();
			let result = response.data;

			if (response.status === 200) {
				return result;
			} else {
				throw thunkAPI.rejectWithValue(response.status);
			}
		} catch (error) {
			return thunkAPI.rejectWithValue(error.message);
		}
	}
);

export const fetchGames = createAsyncThunk(
	"lobby/fetchGames",
	async (_, thunkAPI) => {
		try {
			const response = await LobbyAPI.getGames();
			let games = response.data;
		
			if (response.status === 200) {
				return games;
			} else {
				throw thunkAPI.rejectWithValue(response.status)
			}
		} catch (error) {
			return thunkAPI.rejectWithValue(error.message)
		}
	}
);

export const createNewGame = createAsyncThunk(
	"lobby/createNewGame",
	async ({roomName, playerCap, turnMax, betMax}, thunkAPI) => {
		try {
			const response = await LobbyAPI.postNewGame(roomName, playerCap, turnMax, betMax);
			let { game } = response.data;
			
			if (response.status === 200) {
				return { game }
			} else {
				throw thunkAPI.rejectWithValue(response.status)
			}
		} catch (error) {
			return thunkAPI.rejectWithValue(error.message)
		}
	}
);

const initialLobbyState = () => ({
	userId: null,
	isFetching: false,
	isError: false,
	errorMessage: "",
	rooms: [],
})

export const lobbySlice = createSlice({
	name: 'lobby',
	initialState: initialLobbyState(),
	reducers: {
		lobbyStateReset(state) {
			return {
				...initialLobbyState(),
				rooms: state.rooms
			}
		}
	},
	extraReducers: (builder) => {
		builder.addCase(fetchUserId.fulfilled, (state, action) => {
			state.userId = action.payload.id;
			state.isFetching = false;
		})
		builder.addCase(fetchUserId.pending, (state, action) => {
			state.isFetching = true;
		})
		builder.addCase(fetchUserId.rejected, (state, action) => {
			state.isFetching = false;
			state.isError = true;
			state.errorMessage = action.payload;
		})
		builder.addCase(fetchGames.fulfilled, (state, action) => {
			state.isFetching = false;
			state.rooms = action.payload;
		})
		builder.addCase(fetchGames.pending, (state) => {
			state.isFetching = true;
		})
		builder.addCase(fetchGames.rejected, (state, action) => {
			state.isFetching = false;
			state.isError = true;
			state.errorMessage = action.payload;
		})
		builder.addCase(createNewGame.fulfilled, (state, action) => {
			state.isFetching = false;
			state.rooms = { ...state, rooms: { ...state.rooms, ...action.payload } };
		})
		builder.addCase(createNewGame.pending, (state) => {
			state.isFetching = true;
		})
		builder.addCase(createNewGame.rejected, (state, action) => {
			state.isFetching = false;
			state.isError = true;
			state.errorMessage = action.payload;
		})
	},
});

export const { lobbyStateReset } = lobbySlice.actions;
export const lobbySelector = state => state.lobby;