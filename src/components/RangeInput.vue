<template>
    <div>
        <p>
            <label>{{label}}</label>
        </p>
        <input type="range" :min="min" :max="max" :step="step" :value=value  @input="updateValue"> 
            <input type="number" :min="min" :max="max" :step="step" :value=value @input="updateValue"  width="40px">
    </div>
</template>

<script>
export default {
    props: {
        value: Number,
        label: String,
        min: Number,
        max: Number,
        step: Number
    },
    emits:['input'],
    setup(props, {emit}) {
        const updateValue = (event) => {
            emit('input', parseFloat(event.target.value));
        }

        return { updateValue }
    }

}
</script>

<style>
</style>