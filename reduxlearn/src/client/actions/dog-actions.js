/**
 * Created by liuxiaofan on 2017/1/5.
 * action creator
 */
export const MAKE_BARK = 'MAKE_BARK';

export const makeBark = () => ({
    type: MAKE_BARK,
    payload: true,
});