<script>
	import Button from '$lib/components/Button.svelte';
	import ComboBox from '$lib/components/ComboBox.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import { taxonomy } from '@repo/taxonomy';
	import { createResourceForm } from './addResource.remote';
</script>

<form class="newResource" {...createResourceForm} onchange={() => createResourceForm.validate()}>
	<h2>New Resource</h2>
	<TextInput label="Name" name="name" issues={createResourceForm.fields.name.issues()} />
	<TextInput label="Slug" name="slug" issues={createResourceForm.fields.slug.issues()} />
	<TextInput
		label="Description"
		name="description"
		issues={createResourceForm.fields.description.issues()}
	/>
	<ComboBox
		label="Category"
		name="category"
		items={taxonomy.categories.map((item) => [item, item])}
		issues={createResourceForm.fields.category.issues()}
	/>
	<div class="buttons">
		<Button type="submit">Create</Button>
	</div>
	{#if createResourceForm.result}
		{#if createResourceForm.result.error}
			<div class="errorMessage">
				{createResourceForm.result.message}
			</div>
		{:else}
			Resource Created!
		{/if}
	{/if}
</form>

<style lang="scss">
	.newResource {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		max-width: 30rem;

		h2 {
			margin: 0;
		}
	}
</style>
