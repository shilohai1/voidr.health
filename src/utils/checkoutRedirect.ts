export const checkoutUrls = {
  clinical_starter: 'https://buy.polar.sh/polar_cl_cV1a6rzBp9o3R2OjH6F0pIxNevppLcd1n0sff0I5eGI',
  clinical_pro: 'https://buy.polar.sh/polar_cl_w58BlnB3fhSZhMK07JZGA3EuocVjS1HppU1U14AtqHe',
  wise_starter: 'https://buy.polar.sh/polar_cl_qZEyoG4QHG5584E73QQ28Py5Pt77MYeUnAgQv1vj8MK',
  wise_pro: 'https://buy.polar.sh/polar_cl_xB2RTXzohCHZmp9I6kzrCZwqxFgYHvUIuUhTM0dAoZl',
  launch_bundle: 'https://buy.polar.sh/polar_cl_dtyIfCwh9E6x9e42RTPAf7ZEV810wim8s0C650JQ37B'
}

export const handleCheckoutRedirect = (plan: keyof typeof checkoutUrls, isLoggedIn: boolean) => {
  if (!isLoggedIn) {
    // Redirect to login/signup page before checkout
    window.location.href = '/auth?redirect=' + encodeURIComponent(checkoutUrls[plan]);
  } else {
    window.location.href = checkoutUrls[plan];
  }
}
