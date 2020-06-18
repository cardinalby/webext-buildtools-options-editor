import { collapseOptionalParams, adjustSchema, setSecretsEnvVariables } from './jsonEditorUtils.js';
// @ts-ignore
import schema from './buildRunnerOptionsSchema.js';
import { IBuildRunnerOptions } from 'webext-buildtools-integrated-builder/declarations/buildRunnerOptions';



JSONEditor.defaults.theme = 'spectre';
JSONEditor.defaults.iconlib = 'spectre';

const editorHolderEl = document.getElementById('editor_holder');
const submitButtonEl = document.getElementById('submit');
const resultTextArea = document.getElementById('result-json') as HTMLTextAreaElement;
const validIndicatorEl = document.getElementById('valid_indicator');

if (!editorHolderEl || !submitButtonEl || !resultTextArea || !validIndicatorEl) {
    throw new Error('Elements not found');
}

adjustSchema(schema);
collapseOptionalParams(schema);

// Initialize the editor
const editor = new JSONEditor(
    editorHolderEl,
    {
        ajax: true,
        schema,
        display_required_only: false,
        show_opt_in: true,
        prompt_before_delete: false,
        object_layout: 'table',
        form_name_root: 'Build Runner options',
        disable_edit_json: true
    }
    );

setSecretsEnvVariables(editor);

submitButtonEl.addEventListener('click', () => {
    resultTextArea.value = JSON.stringify(editor.getValue(), null, 4);
    resultTextArea.select();
});

editor.on('change', () => {
    const errors = editor.validate();
    if (errors.length) {
        validIndicatorEl.className = 'label alert';
        validIndicatorEl.textContent = 'not valid';
    } else {
        validIndicatorEl.className = 'label success';
        validIndicatorEl.textContent = 'valid';
    }
});