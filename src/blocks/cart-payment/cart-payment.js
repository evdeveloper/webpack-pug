import {postData} from '@/js/common/ajax';

export default async function cartPaymentInit() {
  const paymentForm = document.querySelector('#cartPaymentForm');

  console.log(paymentForm, 'paymentForm');

  if (!paymentForm) {
    return;
  }

  paymentForm.addEventListener('submit', e => {
    e.preventDefault();

    const submitBtn = document.querySelector('[form="cartPaymentForm"]');
    submitBtn.classList.add('disabled');

    const action = paymentForm.getAttribute('action');
    const formData = new FormData(paymentForm);

    postData(action, {
      body: formData,
      headers: {},
    }).then(res => {
      if (res.success) {
        window.location.href = res.href;
      } else alert(res.error);
    });
  });
}
