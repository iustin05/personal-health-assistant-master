<script>
    export let profileLogic;
    export let profile;
    export let isSaving;
  </script>
  
  <div class="space-y-6">
    <div class="form-control">
      <label class="label">
        <span class="label-text font-medium">Medications</span>
      </label>
      <textarea 
        bind:value={profile.medications}
        class="textarea textarea-bordered h-24"
        placeholder="List your current medications..."
      ></textarea>
    </div>
  
    <div class="form-control">
      <label class="label">
        <span class="label-text font-medium">Allergies</span>
      </label>
      <textarea 
        bind:value={profile.allergies}
        class="textarea textarea-bordered h-24"
        placeholder="List any allergies..."
      ></textarea>
    </div>
  
    <div class="form-control">
      <label class="label">
        <span class="label-text font-medium">Medical Conditions</span>
      </label>
      <textarea 
        bind:value={profile.medical_conditions}
        class="textarea textarea-bordered h-32"
        placeholder="Describe your medical conditions..."
      ></textarea>
    </div>
  
    <div class="flex justify-end space-x-4">
      <button 
        class="btn btn-primary {isSaving ? 'loading' : ''}"
        on:click={() => profileLogic.handleSave()}
        disabled={isSaving}
      >
        {isSaving ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  </div>