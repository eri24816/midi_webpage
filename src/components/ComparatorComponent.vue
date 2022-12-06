<template>
  <div style="margin-bottom: 100px;">
    <h2>{{ title }}</h2>
    <div class="rowflexbox">
      <div>
        <h3>1. Select a independent param</h3>
        <Select2  name="IndependentParam"  v-model="independent_param_name" @select="(event)=>OnIndependentParamSelect(event.id)" :options="Object.keys(dimensions)" :settings="{width: '300px',minimumResultsForSearch: Infinity}" />
      </div>
      <div>
        <h3>2. Choose {{num_elements}} values of "{{independent_param_name}}" to compare</h3>
        <Select2 v-for="(independent_param_value, i) in independent_param_values" :name="'indsel'+i" :key="'indsel'+i" v-model="independent_param_values[i]" @select="(event)=>OnIndependentParamChanged(i,event.id)" :options="dimensions[independent_param_name].value_range" :settings="{width: '300px',minimumResultsForSearch: Infinity}"/>
      </div>
      <div>
        <h3>3. Set the control param</h3>
        <div  v-for="(control_param_name, i) in Object.keys(control_params)" :key="'consel'+i" class="colflexbox" >
          {{control_param_name}}
          <Select2 :name="'consel'+i" v-model="control_params[control_param_name]" @select="(event) => OnControlParamChanged(control_param_name,event.id)" :options="dimensions[control_param_name].value_range" :settings="{width: '300px',minimumResultsForSearch: Infinity}"/>
        </div>
      </div>
    </div>
    <PixiMidiBlock v-for="file in files_element" :key="file"  :w="1000" :h="250" :padding="20" :sustainOpacity="0.4" :bpm="140" :src="file" style="width:1000px" class="centered-block"/>
  </div>

</template>

<script>
/* eslint-disable */
import PixiMidiBlock from './PixiMidiBlock.vue';
function CastAllValueToString(d) {
  for (var key in d) {
    if (d.hasOwnProperty(key)) {
      if (typeof d[key] === 'object') {
        CastAllValueToString(d[key]);
      } else {
        d[key] = d[key].toString();
      }
    }
  }
  return d;
}
export default {
  name: 'ComparatorComponent',
  components: {
    PixiMidiBlock,
  },
  props: {
    folder: String,
    num_elements: {
      type: Number,
      default: 2
    },
    title: {
      type: String,
      default: 'Comparison'
    },
  },
  data: function() {
    return {
      dimensions: {dummy: {
      name: "dummy",
      value_range: [0],
      "relevant": true
    }},
      entries: {},
      entries_reverse_map: {},
      control_params: {},
      independent_param_name: "dummy",
      independent_param_values: [],
      params_element: [],
      files_element: [],
    }
  },
  methods: {
    SetupWithMetadata(metadata) {
      this.dimensions = metadata.dimensions;
      this.entries = metadata.entries; // dictionary of entries
      this.entries_reverse_map = {}
      for (const [key, value] of Object.entries(this.entries)) {
        this.entries_reverse_map[JSON.stringify(CastAllValueToString(value),Object.keys(value).sort())] = key;
      }
      this.OnIndependentParamSelect(Object.keys(this.dimensions)[0]);
    },
    GetFileWithParamsDict(params_dict) {
      console.log("GetFileWithParamsDict", params_dict);
      console.log("entries_reverse_map", this.entries_reverse_map);
      return this.entries_reverse_map[JSON.stringify(CastAllValueToString(params_dict),Object.keys(params_dict).sort())];
    },
    UpdateElements() {
      // update params for each element
      for (let i = 0; i < this.num_elements; i++) {
        const params_dict = Object.assign({}, this.control_params);
        params_dict[this.independent_param_name] = this.independent_param_values[i];
        this.params_element[i] = params_dict
      }
      const files_element_new = []
      for (let i = 0; i < this.num_elements; i++) {
        files_element_new.push(this.folder + "/" + this.GetFileWithParamsDict(this.params_element[i]));
      }
      this.files_element = files_element_new;
    },
    OnIndependentParamSelect(name) {
      console.log("Independent param selected", name);
      // set the independent param
      this.independent_param_name = name;
      const independent_param_values_new = [];
      for(let i=0; i<this.num_elements; i++) {
        independent_param_values_new.push(this.dimensions[name].value_range[Math.min(i, this.dimensions[name].value_range.length-1)]);
      }
      this.independent_param_values = independent_param_values_new;
      // update the control params
      this.control_params = {}
      for (const [key, value] of Object.entries(this.dimensions)) {
        if (key != name) {
          this.control_params[key] = value.value_range[0];
        }
      }
      this.UpdateElements();
    },
    OnIndependentParamChanged(i,value) {
      console.log("Independent param changed", value);
      console.log(this.independent_param_values)
      this.independent_param_values[i] = value;
      this.UpdateElements();
    },
    OnControlParamChanged(name,value) {
      console.log("Control param changed", name, value);
      this.control_params[name] = value;
      this.UpdateElements();
    },
  },
  mounted() {
    fetch(this.folder+'/metadata.json')
      .then(response => response.text())
      .then(text => JSON.parse(text))
      .then(metadata => this.SetupWithMetadata(metadata));
  },
}
</script>

<style scoped>
.centered-block{
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-top: 10px;
  margin-bottom: 10px;
}

.rowflexbox{
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
}

.colflexbox{
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
}

</style>