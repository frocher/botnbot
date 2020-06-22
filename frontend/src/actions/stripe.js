import { createAction } from '@reduxjs/toolkit';
import { loadStripe } from '@stripe/stripe-js';
import { fetchCredentials } from '../common';

export const stripeCheckoutSuccess = createAction('STRIPE_CHECKOUT_SUCCESS');
export const stripeCheckoutError = createAction('STRIPE_CHECKOUT_ERROR');

export const stripeCheckout = (stripeKey, priceId) => async (dispatch) => {
  try {
    const options = {
      method: 'POST',
      headers: fetchCredentials(),
    };

    const response = await (await fetch(`/api/stripe/session?price_id=${priceId}`, options)).json();
    const stripe = await loadStripe(stripeKey);
    const { error } = await stripe.redirectToCheckout({ sessionId: response.id });
    if (error) {
      dispatch(stripeCheckoutError(error));
    } else {
      dispatch(stripeCheckoutSuccess());
    }
  } catch (err) {
    dispatch(stripeCheckoutError(err));
  }
};
