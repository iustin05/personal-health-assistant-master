<script>
    import { t } from '$lib/translations/translations';
    
    export let profileLogic;
    export let profile;
    export let isSaving;
  </script>
  
  <div class="space-y-6">
    <div class="form-control">
      <label class="label">
        <span class="label-text font-medium">{$t('profile.fields.medications.label')}</span>
      </label>
      <textarea
        bind:value={profile.medications}
        class="textarea textarea-bordered h-24"
        placeholder={$t('profile.fields.medications.placeholder')}
      ></textarea>
    </div>
  
    <div class="form-control">
      <label class="label">
        <span class="label-text font-medium">{$t('profile.fields.allergies.label')}</span>
      </label>
      <textarea
        bind:value={profile.allergies}
        class="textarea textarea-bordered h-24"
        placeholder={$t('profile.fields.allergies.placeholder')}
      ></textarea>
    </div>
  
    <div class="form-control">
      <label class="label">
        <span class="label-text font-medium">{$t('profile.fields.medicalConditions.label')}</span>
      </label>
      <textarea
        bind:value={profile.medical_conditions}
        class="textarea textarea-bordered h-32"
        placeholder={$t('profile.fields.medicalConditions.placeholder')}
      ></textarea>
    </div>
  
    <div class="flex justify-end space-x-4">
      <button
        class="btn btn-primary {isSaving ? 'loading' : ''}"
        on:click={() => profileLogic.handleSave()}
        disabled={isSaving}
      >
        {isSaving ? $t('profile.saving') : $t('profile.saveButton')}
      </button>
    </div>
  </div>