import { createAction } from '@reduxjs/toolkit';
import { loadStripe } from '@stripe/stripe-js';
import { fetchCredentials } from '../../utilities/credentials';

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

export const stripeManageSubscriptionSuccess = createAction('STRIPE_MANAGE_SUBSCRIPTION_SUCCESS');
export const stripeManageSubscriptionError = createAction('STRIPE_MANAGE_SUBSCRIPTION_ERROR');

export const stripeManageSubscription = () => async (dispatch) => {
  try {
    const options = {
      method: 'POST',
      headers: fetchCredentials(),
    };

    const response = await (await fetch('/api/stripe/customer_portal_session', options)).json();
    dispatch(stripeManageSubscriptionSuccess());
    window.location.replace(response.url);
  } catch (err) {
    dispatch(stripeManageSubscriptionError(err));
  }
};
