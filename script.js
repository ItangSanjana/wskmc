/*
    Copyright 2013 Itang Sanjana

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/

'use strict';

const openSnackbar = (...params) => {
    const MDCSnackbar = mdc.snackbar.MDCSnackbar;
    const snackbar = new MDCSnackbar(document.querySelector('.mdc-snackbar'));
    snackbar.timeoutMs = 10000;
    snackbar.labelText = params.join(' ');
    snackbar.open();
};

const showError = err => {
    console.error(err);
    openSnackbar('Error', err.code, ':', err.message);
};

const clickButtonShare = event => {
    if ('share' in navigator) {
        navigator.share({
            title: document.title,
            text: document.querySelector('meta[name=description]').content,
            url: document.URL
        }).catch(showError);
    } else {
        const input = document.createElement('input');
        document.body.appendChild(input);
        input.value = document.URL;
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        openSnackbar(event.target.title, ':', 'URL telah disalin ke papan klip.');
    }
};

const enabledShare = () => {
    const buttonShare = document.querySelector('button[title=Share]');
    buttonShare.addEventListener('click', clickButtonShare);
    buttonShare.disabled = false;
};

const initApp = () => {
    if ('content' in document.createElement('template') != true) {
        const errorTemplate = {
            code: '418',
            message: 'The HTML template element is not supported. Use modern web browser instead.'
        }
        showError(errorTemplate);
        return;
    }

    enabledShare();

    const MDCTopAppBar = mdc.topAppBar.MDCTopAppBar;
    const topAppBar = document.querySelector('.mdc-top-app-bar');
    const mdcTopAppBar = new MDCTopAppBar(topAppBar);

    const MDCDrawer = mdc.drawer.MDCDrawer;
    const drawer = document.querySelector('.mdc-drawer');
    const mdcDrawer = new MDCDrawer(drawer);

    mdcTopAppBar.listen('MDCTopAppBar:nav', () => mdcDrawer.open = !mdcDrawer.open);

    const MDCRipple = mdc.ripple.MDCRipple;
    mdcDrawer.list.listElements.map(drawerListItem => new MDCRipple(drawerListItem));

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(showError);
    }
};

window.addEventListener('load', initApp);
