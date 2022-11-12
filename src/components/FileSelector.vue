<template>
    <div>
        <div style="display: inline-block;">
            <Select2  name="folder" id="folder" v-model="folder" @select="(event)=>OnFolderSelect(event.id)" :options="folders" :settings="{width: '100px',minimumResultsForSearch: Infinity}" />
        </div>
        /
        <div style="display: inline-block;">
            <Select2  name="file" id="file" v-model="filename" @select="(event)=>OnFileSelect(event.id)" :options="filenames" :settings="{width: '200px',minimumResultsForSearch: Infinity}" />
        </div>
    </div>
</template>

<script>
/* eslint-disable */
import Select2 from 'vue3-select2-component';
function SetupFolder(metadata) {
    this.folders = metadata.queries;
    console.log(this.folders);
    this.OnFolderSelect(this.folders[0]);
}

function OnFolderSelect(event) {
    console.log("Folder selected", event);
    this.folder = event;
    fetch(this.root+this.folder+'/metadata.json')
            .then(response => response.text())
            .then(text => JSON.parse(text))
            .then(metadata => SetupFile.call(this, metadata));
}

function SetupFile(metadata) {
    this.files = metadata.files;
    //get keys
    this.filenames = Object.keys(this.files);
    console.log(this.files, this.filenames);
    this.OnFileSelect(this.filenames[0]);
}

function OnFileSelect(event) {
    console.log("File selected");
    this.filename = event;
    console.log(this.filename);
    this.updateValue(this.root+this.folder+"/"+this.filename);
}

export default {
    components:{Select2},
    props: {
        value: Number,
        root: String,
    },
    data: function() {
        return {
            folders: [],
            files: {},
            filenames: [],
            folder: '',
            filename: '',
        }
    },
    methods: { SetupFolder, SetupFile, OnFolderSelect, OnFileSelect },
    emits:['input'],
    setup(props, { emit }) {
        const updateValue = (value) => {
            console.log("updateValue",value);
            emit('input', value);
        }

        return { updateValue }
    },
    
    mounted() {
        // read json file
        fetch('/midi/similar/metadata.json')
            .then(response => response.text())
            .then(text => JSON.parse(text))
            .then(metadata => SetupFolder.call(this, metadata));


    }
}
</script>

<style :v-deep>
select{
    background-color: black;
    color: wheat;
    scrollbar-color: dark;
}
option{
    background-color: black;
    color: wheat;
}

::selection {
  background: rgb(77, 57, 34);
}

/* width */
::-webkit-scrollbar {
  width: 5px;
}

/* Track */
::-webkit-scrollbar-track {
  background: rgb(3, 3, 3);
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: rgb(46, 42, 34);
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
    background: rgb(26, 23, 19);
}


::v-deep(.select2-search) {
    background-color: #343A40 !important;
}
    /* Change the appearence of the search input field */
    .select2-search input {
        color: wheat !important;
        background-color: #343A40 !important;
    }

/* Change the appearence of the search results container */
::v-deep(.select2-results) {
    background-color: #343A40 !important;
}

/* Change the appearence of the dropdown select container */
::v-deep(.select2-container--bootstrap-5 .select2-selection) {
    border-color: #474e53 !important;
    color: wheat !important;
    background-color: #343A40 !important;
}

/* Change the caret down arrow symbol to white */
::v-deep(.select2-container--bootstrap-5 .select2-selection--single ){
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='white' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e") !important;
}

/* Change the color of the default selected item i.e. the first option */
.select2-container--default .select2-selection--single .select2-selection__rendered {
    background-color: black;
    color: wheat !important;
}

.select2-results__option--highlighted[aria-selected]{
    background-color: rgb(29, 20, 14)  !important;
    color: wheat;
}

.select2-results__option[aria-selected=true]{
    background-color: rgb(78, 53, 35)  !important;
}

.select2-results__option[aria-selected]{
    background-color: black;
    color: wheat;
}

</style>