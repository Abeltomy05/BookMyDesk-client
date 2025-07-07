import type { IClient } from "@/types/user.type";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface ClientState {
	client: IClient | null;
}

const initialState: ClientState = {
	client: null,
};

const clientSlice = createSlice({
    name: "client",
	initialState,
	reducers: {
		clientLogin: (state, action: PayloadAction<IClient>) => {
			state.client = action.payload;
            // console.log('client login',state.client)
		},
		clientLogout: (state) => {
			state.client = null;
		},
	},
})

export const { clientLogin, clientLogout } = clientSlice.actions;
export default clientSlice.reducer;