<?php namespace VisualComposer\Helpers\Generic;

class Request
{
    protected $data = null;

    /**
     * Determine if the request contains a given input item key.
     *
     * @param  string|array $key
     * @return bool
     */
    public function exists($key)
    {
        $keys = is_array($key) ? $key : func_get_args();

        $input = $this->input();

        foreach ($keys as $value) {
            if (!array_key_exists($value, $input)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Retrieve an input item from the request.
     *
     * @param  string $key
     * @param  mixed $default
     * @return string|array
     */
    public function input($key = null, $default = null)
    {
        if (is_null($this->data)) {
            $this->data = array_replace_recursive($_POST, $_GET, $_REQUEST);
        }
        if (is_null($key)) {
            return $this->data;
        }

        return array_key_exists($key, $this->data) ? $this->data[ $key ] : $default;
    }

    /**
     * Get an input element from the request.
     *
     * @param  string $key
     * @return mixed
     */
    public function __get($key)
    {
        if ($this->exists($key)) {
            return $this->input($key);
        }
    }
}
