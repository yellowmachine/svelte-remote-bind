<script>
    import { useRemoteBind } from '$lib';
    import Cat from './cat.svelte'

    let person = {name: 'yellowman', cats: []}

    function addCat(cat){
        person.cats = [...person.cats, cat]
    }

    const { state, update} = useRemoteBind({id: 1, bind: 'endpoint:person'})

    $: update(person)
</script>

<Cat onCreated={addCat} />

<div>
    <span>Id cats of yellow man:</span>
    <ul>
	{#each person.cats as cat}
		<li>
			Id: {cat.id}
		</li>
	{/each}
    </ul>
    <div>State of Person: {$state.value}</div>
</div>
