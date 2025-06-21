import { createSelector } from "@reduxjs/toolkit";
import type{ RootState } from "@/store/store"; 

  export const getActiveSession = createSelector(
	(state: RootState) => state.client.client,
	(state: RootState) => state.vendor.vendor,
	(state: RootState) => state.admin.admin,
	(client, vendor, admin) => {
		if (client) return { role: client.role, type: "client" };
		if (vendor) return { role: vendor.role, type: "vendor" };
		if (admin) return { role: admin.role, type: "admin" };
		return null;
	}
);

//createSelector is used to memoize the result of the selector function, which can improve performance by preventing unnecessary re-computations when the state hasn't changed.
// This selector checks the Redux state for the presence of a client, vendor, or admin session and returns the corresponding role and type. If none are found, it returns null.