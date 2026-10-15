/* Email-app fallback only. No backend, tracking, local storage or automatic email sends. */
(() => {
    document.querySelectorAll('.feedback-panel').forEach(panel => {
        const form = panel.querySelector('.feedback-form');
        const status = panel.querySelector('.feedback-status');
        const manual = panel.querySelector('.feedback-manual');
        const draft = panel.querySelector('.feedback-draft');
        const recipient = (panel.dataset.feedbackRecipient || '').trim();
        // The public recipient is supplied by the gallery owner.
        if (!form || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient)) {
            status.textContent = 'Feedback email is not configured yet. Please use the gallery contact links.';
            return;
        }
        form.hidden = false;
        const directLink = panel.querySelector('.feedback-email-link');
        directLink.href = `mailto:${recipient}`;
        directLink.textContent = recipient;
        directLink.hidden = false;
        const subject = 'Satyam Art Gallery — Website feedback';
        function message() {
            return `Name: ${form.elements.name.value.trim()}\nEmail: ${form.elements.email.value.trim()}\n\nFeedback:\n${form.elements.feedback.value.trim()}`;
        }
        function validate() {
            ['name', 'email', 'feedback'].forEach(key => {
                const input = form.elements[key];
                input.setCustomValidity(input.value.trim() ? '' : 'Please fill in this field.');
            });
            return form.reportValidity();
        }
        form.addEventListener('input', event => {
            if (event.target.setCustomValidity) event.target.setCustomValidity('');
            status.textContent = '';
            manual.hidden = true;
            draft.value = '';
        });
        form.addEventListener('submit', event => {
            event.preventDefault();
            if (!validate()) return;
            const body = message();
            const mailto = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            draft.value = `To: ${recipient}\nSubject: ${subject}\n\n${body}`;
            manual.hidden = false;
            status.textContent = 'Your email app is being opened. Review the draft and send it there. Nothing has been sent by this website. If no draft opens, copy the message below into your email app.';
            // Deliberately retain all fields: opening a draft is not proof of sending.
            window.location.href = mailto;
        });
        panel.querySelector('.feedback-copy').addEventListener('click', async () => {
            if (!validate()) return;
            draft.value = `To: ${recipient}\nSubject: ${subject}\n\n${message()}`;
            manual.hidden = false;
            try {
                if (!navigator.clipboard || !window.isSecureContext) throw new Error('Clipboard unavailable');
                await navigator.clipboard.writeText(draft.value);
                status.textContent = 'Feedback copied. Paste it into your email app and send it. Nothing has been sent by this website.';
            } catch (error) {
                draft.focus();
                draft.select();
                status.textContent = 'Automatic copying is unavailable. Select and copy the draft below, then send it from your email app.';
            }
        });
    });
})();
