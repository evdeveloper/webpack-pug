import { slideToggle } from '@/js/common/plugins';

const triggers = document.querySelectorAll('.mobile-nav__button');

triggers.forEach(element => {
    element.addEventListener('click', function(){
        const list = this.nextElementSibling;
        if(list) slideToggle(list);
    });
});