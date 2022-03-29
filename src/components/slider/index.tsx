import React, { useState } from 'react';
import { Field, FieldProps, FieldRenderProps } from 'react-final-form';
import styles from './slider.module.scss';

export interface SliderProps
    extends FieldProps<number, FieldRenderProps<number>, HTMLInputElement> {
    step?: number;
    min?: number;
    max?: number;
    label?: string;
    minLabel?: string;
    maxLabel?: string;
    hideValue?: boolean;
}

let idg = 0;

export const Slider = ({
    step,
    max,
    min,
    label,
    minLabel,
    maxLabel,
    hideValue,
    ...fieldProps
}: SliderProps) => {
    const [id] = useState(() => `slider_${idg++}`);
    return (
        <Field
            {...fieldProps}
            render={({ input }) => (
                <fieldset className={styles.slider}>
                    {label && (
                        <label htmlFor={id} className={styles.label}>
                            {label}
                        </label>
                    )}
                    <input
                        {...input}
                        id={id}
                        type="range"
                        step={step}
                        min={min}
                        max={max}
                        className={styles.input}
                    />
                    <div className={styles.numbers}>
                        <span>{minLabel || min}</span>
                        <span className={styles.sliderValue}>
                            {hideValue || input.value}
                        </span>
                        <span>{maxLabel || max}</span>
                    </div>
                </fieldset>
            )}
        ></Field>
    );
};

export default Slider;
