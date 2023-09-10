//This is a component that can be used to wrap any other component and make it clickable
import type { DetailedHTMLProps, HTMLAttributes } from 'react';

export function ClickableDiv(props: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) {
    return (
        <div
            role="button"
            tabIndex={(props as any)?.disabled ? -1 : 0}
            onKeyDown={event => {
                event.preventDefault();
                if ((event.key === 'Enter' || event.key === ' ') && props.onClick) {
                    props.onClick({} as any);
                }
            }}
            aria-disabled={(props as any)?.disabled ? 'true' : 'false'}
            {...props}
        />
    );
}
