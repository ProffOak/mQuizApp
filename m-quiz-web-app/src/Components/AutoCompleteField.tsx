import TextField from "@material-ui/core/TextField"
import Typography from "@material-ui/core/Typography"
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Fragment, useEffect, useState } from "react";


interface Props {
    style? : React.CSSProperties
    text: string,
    getOptions:  (query:string) => Promise<string[]>
    value: string,
    setValue: (value:string) => void

}

const AutocompleteField: React.FC<Props> = ({text, getOptions, style, value, setValue}) => {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState <string[]> ([]);

    
    //const [inputValue, setInputValue] = useState <string>('');
    const [loading, setLoading] = useState(open && options.length === 0)
  
  
    useEffect(() => {
      let active = true;
      console.log(value);
     
  
      (async () => {

        if(value.length>=2) {
            const options = await getOptions(value);
            setLoading(false);
            console.log(options)
  
            if (active) {

            setOptions(options);
            }
        } else {
          setLoading(false);
          setOptions([])
        }

        
      })();
  
      return () => {
        active = false;
      };
    }, [value]);
  
    useEffect(() => {
      if (!open) {
        setOptions([]);
      }
    }, [open]);
    
    
    
    return (
        <Autocomplete style={style}
        freeSolo
        onInputChange={(event, newInputValue) => {
            setLoading(true);
            setValue(newInputValue);
        }}

        open={open}
        onOpen={() => {
          setOpen(true);
        }}
        onClose={() => {
          setOpen(false);
        }}
        getOptionSelected={(option, value) => option === value}
        getOptionLabel={(option) => {return option as string}}
        options={options}
        loading={loading}
        renderInput={(params) => (
          <TextField
            {...params}
            label={text}
            variant="outlined"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <Fragment>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </Fragment>
              ),
            }}
          />
        )}
      />
    )
}

export default AutocompleteField