const feature = 'settings';

export const getSettings = (state: any) => state.getIn([feature, 'settings']);
